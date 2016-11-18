# TradeIT!
## Server less microtrading platform

Allow your friends and users to trade with popular items, anytime,
anywhere, directly from Slack or another favourite messaging system.

While this can run as normal NodeJS application, main intention was to
utilize AWS Lambda, as a demonstration of potential use.

Concept is simple. Users are sending their orders like `buy slack 99` or
`sell linux 255` to see, if their order was matched with one in the 
orderbook, MySQL database. In case of successful trade, response will be
visible to whole channel, to encourage others to start trading.

User can check existing offers in orderbook by typing `sell win` or 
`buy skype`. There are also special commands like `help` and `products`.

There is no intention to have any user management, inventory or account, 
all is just harmless fun, almost as a game.

For deployment, I recommend to use [LambdaDeploy](https://github.com/taylorking/LambdaDeploy) project.

To create Slack integration (API + slash command) I recommend to follow
[this article](https://medium.com/@pixelcodeuk/create-a-slack-slash-command-with-aws-lambda-83fb172f9a74#.rzjjx3g22).

Have fun!
