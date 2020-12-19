const prefix = process.env.prefix;

const aliasDelete = (content, aliases) => {
  let arg;
  
  for (let i = 0; i < aliases.length; i++) {
    if (content.startsWith(`${prefix}${aliases[i]}`)) {
      arg = content.replace(`${prefix}${aliases[i]}`, '').trim();
      return arg;
    }
  }
}

const random = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1) + min);
};

const sum = (arr) => {
   let s = 0;
   for (let i = 0; i < arr.length; i++) {
      s += parseInt(arr[i]);
   }
   return s;
};

const makeStr = (arr) => {
   let str = "[";
   for (let i = 0; i < arr.length; i++) {
      str += `${arr[i]}, `;
   }
   str = str.substr(0, str.length - 2);
   str += "]";
   return str;
};

module.exports = {
  "aliasDelete": aliasDelete,
  "random": random,
  "sum": sum,
  "makeStr": makeStr
}