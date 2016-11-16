var inquirer = require('inquirer');

// Convention: "no" should be the conservative choice.
// If you mistype the answer, we'll always take it as a "no".
// You can control the behavior on <Enter> with `isYesDefault`.
function prompt(question, isYesDefault) {
  if (typeof isYesDefault !== 'boolean') {
    throw new Error('Provide explicit boolean isYesDefault as second argument.');
  }

  var hint = isYesDefault === true ? '[Y/n]' : '[y/N]';
  var message = question + ' ' + hint;


  var questions = [
    {
      type: 'input',
      name: 'isYes',
      message: message,
      default: function() {
        if(isYesDefault) {
          return 'Y'
        }

        return null;
      }
    }
  ];

  return inquirer.prompt(questions).then(function(answers) {
    console.log(answers.isYes);

    return answers.isYes.match(/^(yes|y)$/i);
  }).catch(function(err) {
    console.log(err);
  })

};

module.exports = prompt;
