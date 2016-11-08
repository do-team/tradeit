
exports.parseInputOrder = function(str, context) {
        var data = str.toUpperCase().split(' ');

        if(data.length > 3)
        {
            context.succeed('Such a command! But not supported, too long. Try /TRD HELP first!');
            return {command: '', product: '', price: 0 };
        }
        return  {
            command: data[0],
            product: data[1],
            price: data[2]
        }
}
