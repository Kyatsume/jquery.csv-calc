# jquery.csv-calc
CSV形式の商品一覧をAjaxで読み込んでHTML内に注文表として表示し、ユーザーの入力に応じて合計金額を算出するjQueryプラグインです。  

- - -
## Demo
http://www.usamimi.info/~sutara/sample2/csv-calc/

- - -
## Usage
###### Load plugin
```html
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="jquery.csv-calc.js"></script>
```

###### JavaScript
```javascript
$(function() {
  $('#products').csvCalc('products.csv');
});
```

###### HTML
```html
<table id="products">
  <tr class="th">
    <th>id</th>
    <th>name</th>
    <th>price</th>
    <th>amount</th>
    <th>sum</th>
  </tr>
  <tr class="product-info" data-csvcalc-repeat>
    <td data-csvcalc-cell="0" data-csvcalc-id></td>
    <td data-csvcalc-cell="1"></td>
    <td data-csvcalc-cell="2" data-csvcalc-price class="price"></td>
    <td><input data-csvcalc-input class="amount" type="number" min="0" value="0"></td>
    <td data-csvcalc-sum class="sum">0</td>
  </tr>
  <tr class="th">
    <th colspan="4" class="th-total">total</th>
    <td data-csvcalc-total class="total">0</td>
  </tr>
</table>
```

※テーブル形式だけでなく、様々な表示に対応できます。

- - -
## Custom data attributes
##### data-csvcalc-repeat
CSVの1行ごとに繰り返し生成される要素に対して指定します。  
値は不要です。

##### data-csvcalc-cell
CSVの1つのセルの値を表示する要素に対して指定します。  
値は、CSVのカラム番号(0から始まる)を指定します。

##### data-csvcalc-id
CSVのカラムのうち、IDとなるカラムの値を表示する要素に対して指定します。  
値は不要です。

##### data-csvcalc-price
CSVのカラムのうち、金額のカラムの値を表示する要素に対して指定します。  
値は不要です。

##### data-csvcalc-input
ユーザの入力欄に対して指定します。  
値は不要です。

##### data-csvcalc-sum
`data-csvcalc-price`と`data-csvcalc-input`の掛け算の結果を表示する要素に対して指定します。  
つまり、1品種の合計金額を表します。  
値は不要です。

##### data-csvcalc-total
注文表全体の総計を表示する要素に対して指定します。  
値は不要です。

- - -
## Options
```javascript
$(function() {
  $('#products').csvCalc('products.csv', {
    line_endings: '\n',
    ignore_first_line: true,
    ignore_last_line: true,
    only_integer: true
  });
});
```

##### line\_endings
CSVの改行コードを指定します。

- default: `'\n'`
- options:
    - `'\n'`: CR + LF or LF (Windows, Unix)
    - `'\r'`: CR (MacOS 9 or lower)

##### ignore\_first\_line
CSVの先頭行をデータとして無視するかどうか。

- default: `true`
- options: `true`, `false`

##### ignore\_last\_line
CSVの最終行をデータとして無視するかどうか。

- default: `true`
- options: `true`, `false`

##### only\_integer
入力値を整数のみに限るかどうか。  
`false`の場合は、小数も受け入れます。  
HTML側でも`<input type="number" step="0.5">`のようにstep属性を記述して対応して下さい。

- default: `true`
- options: `true`, `false`

- - -
## Note
現在、CSVの読み込み処理は原始的で、エスケープやデータ内での改行には対応していません。

- - -
## Author
Yuusaku Miyazaki (宮崎 雄策)

- Mail: toumin.m7@gmail.com
- [Blog](//sutara79.hatenablog.com/entry/2015/08/29/104513)

- - -
## License
[MIT License](http://www.opensource.org/licenses/mit-license.php)