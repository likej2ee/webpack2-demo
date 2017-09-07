var template = `
<ul>
    <% for(var i = 0; i < data.supplies.length; i++) { %>
        <li><%= data.supplies[i] %></li>
    <% } %>
</ul>
`;

var data = {
    supplies: [1, 2, 3, 4, 5, 6]
};

function compile(template) {
    var evalExpr = /<%=(.+?)%>/g;
    var expr = /<%([\s\S]+?)%>/g;

    template = template
        .replace(evalExpr, '`); \n echo($1); \n echo(`')
        .replace(expr, '`); \n $1 \n echo(`');
    template = 'echo(`' + template + '`);';

    var script =
        `(function parse(data) {
        var output = '';

        function echo(html) {
            output += html;
        }

        ${template}
        return output;
    })`;
    return script;
}

console.log(compile(template));

var parse = eval(compile(template));
var html = parse(data);
console.log(html);
