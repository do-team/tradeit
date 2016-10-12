<<<<<<< HEAD
exports.parseInputOrder = function(str) {
        var data = str.toUpperCase().split(' ');
        if(data.length != 3)
        {
            return {comman: '', member:'', value: 0 };
        }
        return  {
            command: data[0],
            member: data[1],
            value: data[2]
        }
=======
exports.parseInputOrder = function(str) {
        var data = str.toUpperCase().split(' ');
        if(data.length != 3)
        {
            return null;
        }
        return  {
            command: data[0],
            member: data[1],
            value: data[2]
        }
>>>>>>> 19eae2f2cdc654cd5a294d4eb6551ed1a6c03598
}