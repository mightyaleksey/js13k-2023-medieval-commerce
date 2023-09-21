/* @flow */

export const headerText = 'Medieval Commerce'

export const introText = 'welcome to veliky novgorod in 1260. you play as a trader who tries to earn enough money to pay back to Mongol tax-collectors by selling salt and grain. your goal is to earn 200 silver for the upcoming round to satisfy mongols. good luck.'

export const helpText: string = [
  'controls:',
  '',
  '• ←/↑/→/↓ or a/w/d/s: move',
  '• space/enter: pick or drop sack',
  '• esc: display help'
].join('\n')

export const defeatText: string = [
  'you lost 😢',
  '',
  'customers did not like your service and you got a negative fame. as a result you failed to earn enough money to pay mongol tax-collectors. try better next time!',
  '',
  'hit refresh to restart'
].join('\n')

export const victoryText: string = [
  'you won 🎉',
  '',
  'your trading activity was fairly successful. you earned enough money and payed to mongol tax-collectors. good job!',
  '',
  'hit refresh to restart'
].join('\n')
