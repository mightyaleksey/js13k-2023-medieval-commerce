# Changelog

All notable changes to this project will be documented in this file.

## Typescript to Flow migration
Changes:
- type system change
- entities use tuples instead of arrays for the components now
- entity inheritance usage to simplify logic sharing between all characters

Improvements:
- saved 7192 - 6996 = 196 bytes
- fixed sack rendering issues (the sack was not applied correctly to the character)
- proper game reset was implemented
- logger injection during development stage