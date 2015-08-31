/**
 * @file jQuery Plugin: jquery.csv-calc
 * @version 1.0.0
 * @author Yuusaku Miyazaki <toumin.m7@gmail.com>
 * @license MIT License
 */
(function($) {

/**
 * @desc プラグインをjQueryのプロトタイプに追加する
 * @global
 * @memberof jQuery
 * @param {string} file - CSVファイルへのパス
 * @param {Object} [option] オプションを格納した連想配列
 * @param {string} [option.line_endings='\n'] - CSVの改行コード('\n': CR+LF or LF, '\r': CR)
 * @param {boolean} [option.ignore_first_line=true] - CSVの先頭行をデータとして無視するかどうか
 * @param {boolean} [option.ignore_last_line=true] - CSVの最終行をデータとして無視するかどうか
 * @param {boolean} [option.only_integer=true] - 入力値を整数のみに限るかどうか
 */
$.fn.csvCalc = function(file, option) {
  return this.each(function() {
    new CsvCalc(this, file, option);
  });
};

/**
 * @global
 * @constructor
 * @classdesc 要素ごとに適用される処理を集めたクラス
 * @param {Object} elem - プラグインを適用するHTML要素
 * @param {string} file - CSVファイルへのパス
 * @param {Object} option - オプションを格納した連想配列
 */
function CsvCalc(elem, file, option) {
  this.elem = elem;
  this.file = file;
  this.option = option;

  this._setOption();
  this._showCSV();
  this._calcTotal();
}

$.extend(CsvCalc.prototype, /** @lends CsvCalc.prototype */ {
  /**
   * @private
   * @desc オプションの初期化
   */
  _setOption: function() {
    this.option =  $.extend({
      line_endings: '\n',
      ignore_first_line: true,
      ignore_last_line: true,
      only_integer: true
    }, this.option);

    // 改行コードのメタ文字は'\n'か'\r'のどちらかに強制する
    this.option.line_endings = (this.option.line_endings == '\r') ? '\r' : '\n';
  },

  /**
   * @private
   * @desc CSVを読み込み、整形し、HTML内で表示する
   */
  _showCSV: function() {
    var self = this;
    $.get(self.file, function(data) {
      data = self._csvToArray(self, data);
      self._showAtHtml(self, data);
    });
  },

  /**
   * @private
   * @desc CSVを配列に変換する
   * @param {Object} self - このクラスのインスタンスオブジェクト
   * @param {string} data - CSVファイルの中身
   * @return {Array}
   */
  _csvToArray: function(self, data) {
    data = data.split(self.option.line_endings);
    if (self.option.ignore_first_line) data.shift(); // 先頭行を取り除く
    for (var i = 0; i < data.length; i++) {
      data[i] = data[i].split(',');
    }
    if (self.option.ignore_last_line) data.pop(); // 最終行を取り除く
    return data;
  },

  /**
   * @private
   * @desc 整形してHTML内で表示する
   * @param {Object} self - このクラスのインスタンスオブジェクト
   * @param {Array} data - CSVを配列に変換したもの
   */
  _showAtHtml: function(self, data) {
    var original = $(self.elem).find('[data-csvcalc-repeat]');
    var column_id = $(original).find('[data-csvcalc-id]').attr('data-csvcalc-cell');
    for (var m = 0; m < data.length; m++) {
      var clone = $(original).clone();
      $(original).before(clone);

      // 値を挿入
      for (var n = 0; n < data[m].length; n++) {
        $(clone).find('[data-csvcalc-cell="' + n + '"]').text(data[m][n]);
      }

      // id, priceの値を保存
      // ! 挿入した値の修飾はこの処理の後で行うこと。
      var elem_id = $(clone).find('[data-csvcalc-id]');
      $(elem_id).attr('data-csvcalc-id', $(elem_id).text());
      var elem_price = $(clone).find('[data-csvcalc-price]');
      $(elem_price).attr('data-csvcalc-price', $(elem_price).text());

      // name属性を作成
      $(clone).find('[data-csvcalc-input]').attr('name', data[m][column_id]);
    }
    $(original).remove();
  },

  /**
   * @private
   * @desc 総額を算出する
   */
  _calcTotal: function() {
    var self = this;
    $(document).on('change', $(self.elem).find('[data-csvcalc-input]'), function(ev) {
      // バリデーションを行う
      var amount = self._validateNumber(self, $(ev.target).val());
      $(ev.target).val(amount); // 画面上の全角数字は、ここで半角となる。
      if (amount === 0) return; // ゼロなら、以下の計算は省略する。

      // 合計を算出・表示
      var parent = $(ev.target).parents('[data-csvcalc-repeat]');
      var price = $(parent).find('[data-csvcalc-price]').text();
      $(parent).find('[data-csvcalc-sum]')
        .text(amount * price)
        .attr('data-csvcalc-sum', amount * price);

      // 総計を算出・表示
      var total = 0;
      $(self.elem).find('[data-csvcalc-sum]').each(function(idx, elem) {
        var sum = Number($(elem).attr('data-csvcalc-sum'));
        if (!isNaN(sum)) total += sum;
      });
      $(self.elem).find('[data-csvcalc-total]')
        .text(total)
        .attr('data-csvcalc-total', total);
    });
  },

  /**
   * @private
   * @desc ユーザの入力を検査: 数値
   * @param {Object} self - このクラスのインスタンスオブジェクト
   * @param {string} val - 対象の入力欄の値
   * @return {number} - 検査済みの数値を返す
   */
  _validateNumber: function(self, val) {
    val = val.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    val = (self.option.only_integer) ? parseInt(val, 10) : Number(val);
    if (isNaN(val)) val = 0; // 数字以外は強制的にゼロとする。
    return val;
  }
}); // end of "$.extend"

})( /** namespace */ jQuery);