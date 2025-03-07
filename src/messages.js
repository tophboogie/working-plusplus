/**
 * Provides messages for random selection.
 *
 * TODO: Add the ability to customise these messages - probably via JSON objects in environment
 *       variables.
 *
 * @author Julian Calaby <julian.calaby@gmail.com>
 */

'use strict';

const helpers = require( './helpers' ),
      operations = require( './operations' ).operations;

const messages = {};

messages[ operations.PLUS ] = [
  {
    probability: 100,
    set: [
      'Congrats! You saved the spot! :raised_hands:',
      'The God of Pro Tools smiles upon you. :smile:',
      'Buy that plugin you always wanted!',
      'Nice work! Do a twirl! :beach-ball:',
      'Breakfast hours are extended for you! :fried_egg:',
      'You have been approved to run for the hills. :sunrise_over_mountains:',
      'Avid Deities have postponed your next Pro Tools crash',
      'You magnificent bastard!',
      'Here\'s a gold star! :star2:',
      'Duey will make you a cocktail!',
      ''
    ]
  },
  {
    probability: 1,
    set: [ ':shifty:' ]
  }
];

messages[ operations.MINUS ] = [
  {
    probability: 100,
    set: [
      'SHAME! SHAME!',
      'Get your shit together! :poop:',
      'Mix in the MR for a week!',
      ':facepunch::anger:',
      'No more snack for you!',
      'Ving is here to :crescent_moon: you.',
      'Your xfer links wil last only 1 day.',
      'You have been disconnected from Lime SFX.',
      'Your next SC talent will use wifi',
      'You 2 pops will be wrong all week',
      'How am I not surprised. :face_palm:',
      'Wow.  Just... wow... :expressionless:',
      'Why are you like this? :thinking_face:',
      'Your bar privileges have been revoked for the day!',
      ''
    ]
  },
  {
    probability: 1,
    set: [ ':shifty:' ]
  }
];

messages[ operations.SELF ] = [
  {
    probability: 100,
    set: [
      'Hahahahahahaha no.',
      'Nope.',
      'No. Just no.',
      'Not cool!'
    ]
  },
  {
    probability: 1,
    set: [ ':shifty:' ]
  }
];

/**
 * Retrieves a random message from the given pool of messages.
 *
 * @param {string}  operation The name of the operation to retrieve potential messages for.
 *                            See operations.js.
 * @param {string}  item      The subject of the message, eg. 'U12345678' or 'SomeRandomThing'.
 * @param {integer} score     The item's current score. Defaults to 0 if not supplied.
 *
 * @returns {string} A random message from the chosen pool.
 */
const getRandomMessage = ( operation, item, score = 0 ) => {

  const messageSets = messages[ operation ];
  let format = '';

  switch ( operation ) {
    case operations.MINUS:
    case operations.PLUS:
      format = '<message> *<item>* now has <score> point<plural>.';
      break;

    case operations.SELF:
      format = '<item> <message>';
      break;

    default:
      throw Error ( 'Invalid operation: ' + operation );
  }

  let totalProbability = 0;
  for ( const set of messageSets ) {
    totalProbability += set.probability;
  }

  let chosenSet = null,
      setRandom = Math.floor( Math.random() * totalProbability );

  for ( const set of messageSets ) {
    setRandom -= set.probability;

    if ( 0 > setRandom ) {
      chosenSet = set.set;
      break;
    }
  }

  if ( null === chosenSet ) {
    throw Error(
      'Could not find set for ' + operation + ' (ran out of sets with ' + setRandom + ' remaining)'
    );
  }

  const plural = helpers.isPlural( score ) ? 's' : '',
        max = chosenSet.length - 1,
        random = Math.floor( Math.random() * max ),
        message = chosenSet[ random ];

  const formattedMessage = format.replace( '<item>', helpers.maybeLinkItem( item ) )
    .replace( '<score>', score )
    .replace( '<plural>', plural )
    .replace( '<message>', message );

  return formattedMessage;

}; // GetRandomMessage.

module.exports = {
  messages,
  getRandomMessage
};
