## textFIRE!
(c) 2019
by Ivor King

This is a tribute game to classic 90s Amiga games, e.g. Menace and Xenon II Meglablast. It uses the Phaser3 Javascript framework.

## Controls

cursor keys - movement  
space - fire  
p - pause  

## Graphics

textFIRE is optimised to run on the following 64-bit configuration (current versions):  
**Chrome**  
**Windows 10**

Running on Mac & Linux has resulted in poor game performance and choppy sprite movement depending on hardware configuration.

## Technologies

Technologies used for the project included:
* Javascript (ES5)
* Phaser3
* Dom-to-image
* jQuery
* GitHub
* Webpack
* Yarn

## Running textFIRE locally

You can clone this repo, then use "npm install", and "http-server" to run it locally.

## Challenges

An early challenge was deciding whether to use Phaser2 or 3. When I started the project for GA, Phaser3 had just been released. While it provided numerous advantages, it also had almost no documentation or tutorials for new functionality. It also saw a fundamental redesign of handling game state. This meant existing tutorials were difficult to follow, and I had to consider Phaser.js source code to determine which functions to use. 

Many Phaser2 functions had been deprecated. Nonetheless I went with Phaser3 to ensure the project would remain current for future updates and to take advantage of newer functionality.

Another challenge was allowing the user to enter the name of their ship, and then using this as a texture for the ship sprite. Phaser3 didn't have a way of readily achieving this,and because of its control of the game loop, I had to use a dom node to image library to achieve it. The final challenge was the starfield and updating star positions with the main game loop while maintaining game performance.

## Support during project development

Thanks to the wonderful GA crew, particularly Joel, John and Theo, for all their patience and assistance to get this working! Also thanks to John Goldmen for help integrating Dom-to-image into this project.
