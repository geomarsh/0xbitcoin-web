const Chart = require('./chart.min');

function generateHoldersGraph(holders, minted) {

  var amount = [];
  var label_list = [];
  var colors = [];

  colors.push('#ff9933');
  colors.push('#d73b3e');
  colors.push('#08457e');
  colors.push('#e1a95f');

console.log(holders);
  // Used to get the 'other' holders
  var sum = 0;

  for(var i = 0; i < holders.length; i++) {

    amount.push(holders[i][2]); // holders[i][2] returns 0xbtc balance
    label_list.push(`${holders[i][0].substring(0,10)}... ${isExchange(holders[i][0])}`); // Pushes address label and a string, wallet or dex.
    // holders[i][0] returns wallet address holders
    // [i][1] returns string 'dex' or 'wallet'

    sum += holders[i][2];
    //Random color
    var randomColor = "#000000".replace(/0/g,function randomColor() {return (~~(Math.random()*16)).toString(16);});
    colors.push(randomColor);
  }

  // This pushes the 'Other Holders'
  amount.unshift(Math.round(minted - sum));
  label_list.unshift('Other Holders');

  var data = {
      datasets: [{
        backgroundColor: colors,
        data: amount
      }],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: label_list
  };

  var myPieChart = new Chart(document.getElementById('pie-holders').getContext('2d'), {
    type: 'pie',
    data: data,
    options: {
         legend: {
            display: false
         }
    }
  });
}

async function getAPIData() {
  return new Promise((resolve, reject) => {
      $.getJSON('http://www.whateverorigin.org/get?url='
      + encodeURIComponent('https://bloxy.info/api/token/token_holders_list?token=0xb6ed7644c69416d67b522e20bc294a9a9b405b31&limit=100&key=ACCm8dVOKllqC&format=table')
      + '&callback=?', function(data) {
      resolve(JSON.parse(data.contents));
      });
    });
  }

async function showHoldersGraph(tokensMinted) {

  var tokenHolders = await getAPIData();

  generateHoldersGraph(tokenHolders, tokensMinted);
}

function isExchange(address) {

  // Add exchanges here
  var exchanges = [{
    address:'0xc91795a59f20027848bc785678b53875934792a1',
    name: 'Mercatox'
  },
  {
    address:'0x8d12a197cb00d4747a1fe03395095ce2a5cc6819',
    name: 'EtherDelta'
  },
  {
    address:'0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208',
    name: 'IDEX'
  },
  {
    address:'0xe03c23519e18d64f144d2800e30e81b0065c48b5',
    name: 'Mercatox 2'
  },
];

console.log(exchanges);

  for(var i = 0; i < exchanges.length; i++) {
    if(address == exchanges[i].address) {
      return exchanges[i].name;
    }
  }

  return 'Wallet';
}

module.exports.showHoldersGraph = showHoldersGraph;
