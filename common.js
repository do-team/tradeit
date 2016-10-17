
exports.parseInputOrder = function(str) {
        var data = str.toUpperCase().split(' ');
        if(data.length != 3)
        {
            return {command: '', product: '', price: 0 };
        }
        return  {
            command: data[0],
            member: data[1],
            value: data[2]
        }
}
