// wait till page is ready for jquery
$(document).ready(function(){
    var localStorage = window.localStorage;
    
    // note: the last six digits are decimals for btc and the last two for usd
    var btcWallet = new bigInt("0");
    var btcPerSec = new bigInt("0");
    
    var previousPrice = 0;
    var btcPrice = 0;
    var yesterdayPrice = 0;
    var change = 0;
    
    // stuff from store
    var buyAmount = 1;
    var items = [{name: "Transistor", amount: 0, price: new bigInt("99"), generates: new bigInt("2"), description: "Useful for bitwise operations"}, 
                {name: "Raspberry Pi", amount: 0, price: new bigInt("999"), generates: new bigInt("10"), description: "Not for consumption"}, 
                {name: "Pentium", amount: 0, price: new bigInt("9999"), generates: new bigInt("95"), description: "Slow, but still effective"}, 
                {name: "GTX 1080", amount: 0, price: new bigInt("68999"), generates: new bigInt("500"), description: "4K ready"},
                {name: "Warehouse", amount: 0, price: new bigInt("840000"), generates: new bigInt("4500"), description: "Rent a warehouse with better ventilation to keep energy costs low"}, 
                {name: "Botnet", amount: 0, price: new bigInt("12500000"), generates: new bigInt("67205"), description: "Use someone's computing power - without their permission of course"}, 
                {name: "Quantum Computer", amount: 0, price: new bigInt("225000000"), generates: new bigInt("620000"), description: "The latest breakthrough in technology"},
                {name: "Divine Shrine", amount: 0, price: new bigInt("45000000000"), generates: new bigInt("8500000"), description: "Pray to the Bitcoin gods for a bull market"},
                {name: "Alien Tech", amount: 0, price: new bigInt("2200000000000"), generates: new bigInt("74500000"), description: "Noone knows what it is used for, but it mines bitcoin well"},
                {name: "Magic Crystal", amount: 0, price: new bigInt("35000000000000"), generates: new bigInt("345000000"), description: "Predicts the best time to sell and buy"},
                {name: "Rift", amount: 0, price: new bigInt("1400000000000000"), generates: new bigInt("8450000000"), description: "Open up a rift to the bitcoin dimension"},
                {name: "Matrix", amount: 0, price: new bigInt("120000000000000000"), generates: new bigInt("90000000000"), description: "Mine bitcoin from a simulated world"}];
    
    // holds the dropped coins in the canvas            
    var coins = [];
    
    // holds the nums that appears when btc clicked
    var clicknums = [];
    
    // clicky big coin
    var bigcoin = {amplitude: 0, original: 0, flux: 0, scale: 0};
    
    // delays for certain actions
    var delays = [0,                 // delay for num that appears when btc clicked
                  10000,             // delay for dropping coins based on btc per sec
                  0];                // delay for dropping coins when btc clicked
    
    var soundEffects = [new Audio('/audio/coin1.wav'), new Audio('/audio/coin2.wav'), new Audio('/audio/coin3.wav')];
    
    // amount of btc to be added every 50 ms
    var mod = 0;
    var div = 0;
    
    // setting up drawing canvas
    var canvas = document.getElementById("canvas");
    
    var c = canvas.getContext("2d");
    
    // images for drawing
    
    var images = [new Image(), new Image(), new Image(), new Image(), new Image()];
    
    // variables for rays
    var rays = [{angle: 0, angleShift: -0.54, opacity: 1, scale: 0.5}, 
                {angle: 0, angleShift: 0.56, opacity: 1, scale: 0.55}, 
                {angle: 0, angleShift: -0.257, opacity: 1, scale: 0.6}, 
                {angle: 0, angleShift: 0.259, opacity: 1, scale: 0.45}, 
                {angle: 0, angleShift: 0.75, opacity: 0, scale: 1.2}, 
                {angle: 0, angleShift: -0.1, opacity: 0, scale: 1.1}];
                
    var opacityShift = 0.02;
    
    // convert big int to decimal format
    function formatBigNum(num, decimals) {
        let str = bigInt(num).toString();
        let d = str.substring(str.length-(decimals.length-1));
        let intPart = bigInt(num).divide(decimals);
        
        let zeroes = decimals.length - d.length - 1;
        let zeroesString = "";
        
        for (var i = 0; i < zeroes; i++)
        {
            zeroesString += "0";
        }
        
        return intPart.toString() + "." + zeroesString + d;
    }
    
    // convert a number in a string to number name format
    function convertNumberName(num, decimal) {
        let edit = num.replace(".", "");
        let length = num.substring(0, num.indexOf(".")).length; 
        let names = ["thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion", "tredecillion", "quattuordecillion"]
        let conversion = num;
        let place = 3;

        while (place <= 45)
        {
            if (length > place)
                conversion = edit.substring(0, length - place) + "." + edit.substring(length - place, length - place + decimal) + " " + names[place/3-1];
            place += 3;
        }
        
        return conversion;
    }
    
    // convert from btc to usd
    function convertToUSD(num) {
        return num.multiply(btcPrice*10000000).divide(1000000000000);
    }
    
    // save progress to local storage
    function saveProgress() {
        if (typeof(Storage) != "undefined") 
        {
            localStorage.setItem("wallet", btcWallet.toString());
            
            for (var i = 0; i < items.length; i++)
            {
                localStorage.setItem("amount"+(i+1), items[i].amount);
            }
            
            $("#snotif").animate({top: "5px"}, 500, function() {
                setTimeout(function() {
                    $("#snotif").animate({top: "-5vh"}, 500);
                }, 3000);
            });
            
        } 
        else 
            console.log("No Local Storage Support.");
    }
    
    // load progress saved in local storage
    function loadProgress() {
        if (typeof(Storage) != "undefined") {
            if (localStorage.length > 0) 
            {
                setBTC(localStorage.getItem("wallet"));
                
                let sum = bigInt(0);
                
                for (var i = 0; i < items.length; i++)
                {
                    items[i].amount = parseInt(localStorage.getItem("amount"+(i+1)));
                    
                    sum = sum.plus(bigInt(items[i].generates).multiply(items[i].amount));
                
                    items[i].price = items[i].price.multiply(Math.pow(12, items[i].amount)).divide(Math.pow(10, items[i].amount));
                }
            
                setBTCPerSec(sum);
            }
        } else {
            console.log("No Local Storage Support.");
        }
    }
    
    function deleteData() {
        if (typeof(Storage) != "undefined") 
        {
            while (localStorage.length > 0)
                localStorage.removeItem(localStorage.key(0));
        } 
        else 
            console.log("No Local Storage Support.");
    }
    
    // reset the entire game
    function reset() {
        deleteData();
        
        items = [{name: "Transistor", amount: 0, price: new bigInt("99"), generates: new bigInt("2"), description: "Useful for bitwise operations"}, 
                {name: "Raspberry Pi", amount: 0, price: new bigInt("999"), generates: new bigInt("10"), description: "Not for consumption"}, 
                {name: "Pentium", amount: 0, price: new bigInt("9999"), generates: new bigInt("95"), description: "Slow, but still effective"}, 
                {name: "GTX 1080", amount: 0, price: new bigInt("68999"), generates: new bigInt("500"), description: "4K ready"},
                {name: "Warehouse", amount: 0, price: new bigInt("840000"), generates: new bigInt("4500"), description: "Rent a warehouse with better ventilation to keep energy costs low"}, 
                {name: "Botnet", amount: 0, price: new bigInt("12500000"), generates: new bigInt("67205"), description: "Use someone's computing power - without their permission of course"}, 
                {name: "Quantum Computer", amount: 0, price: new bigInt("225000000"), generates: new bigInt("620000"), description: "The latest breakthrough in technology"},
                {name: "Divine Shrine", amount: 0, price: new bigInt("45000000000"), generates: new bigInt("8500000"), description: "Pray to the Bitcoin gods for a bull market"},
                {name: "Alien Tech", amount: 0, price: new bigInt("2200000000000"), generates: new bigInt("74500000"), description: "Noone knows what it is used for, but it mines bitcoin well"},
                {name: "Magic Crystal", amount: 0, price: new bigInt("35000000000000"), generates: new bigInt("345000000"), description: "Predicts the best time to sell and buy"},
                {name: "Rift", amount: 0, price: new bigInt("1400000000000000"), generates: new bigInt("8450000000"), description: "Open up a rift to the bitcoin dimension"},
                {name: "Matrix", amount: 0, price: new bigInt("120000000000000000"), generates: new bigInt("90000000000"), description: "Mine bitcoin from a simulated world"}];
    
        setBTCPerSec(0);
        setBTC(0);
        
        updateStoreItems();
        
        // reset store
        for (var i = 0; i < items.length; i++)
        {
            $("#item"+(i+1)).addClass("locked");
            $("#display"+(i+1)).fadeIn(400);
            $("#name"+(i+1)).html("???");
            $("#amount"+(i+1)).addClass("hide");
        }
        
        // reset rays
        rays[5].opacity = 0;
        rays[4].opacity = 0;
    }
    
    // fetches btc price data from the server
    function getData(current) {
        if (current)
        {
            $.post( "/btc.json", function( data ) {
                console.log("Recieved BTC data successfully.");
                
                if (previousPrice == 0) // check if this is the first instance of data recieved and if so then set up the previous price to be use to find the change in price next iteration
                    previousPrice = data;  
                else
                    previousPrice = btcPrice;  // otherwise set previous price as current price before overwriting the current price with new data
                    
                btcPrice = data;  // update the price
                
                change = btcPrice - previousPrice;  // find the change in value
                
                animateChangeEffects(change);
                
                $("#btc").html("$"+(btcPrice/100).toFixed(2));
                $("#difference").html("$"+Math.abs(change/100).toFixed(2));
                $("#usdpersec").html(convertNumberName(formatBigNum(convertToUSD(btcPerSec), "1000"), 3));
            });
        }
        else
        {
            $.post( "/btc_yesterday.json", function( data ) {
                console.log("Recieved Yesterday's BTC data successfully.");
                yesterdayPrice = data;
            });
        }
    }
    
    // change text colors of prices depending on change in value
    function animateChangeEffects(change) {
        if (change != 0) 
            {
                if (change < 0) // price went down
                {
                    $("#btc").css('color', '#FF0000'); // change to red
                    $("#difference").css('color', '#FF0000');
                    $("#change").attr('src','/img/assets/down.png')
                }
                else // price went up
                {
                    $("#btc").css('color', '#008500'); // change to green
                    $("#difference").css('color', '#008500');
                    $("#change").attr('src','/img/assets/up.png')
                }
                
                setTimeout(function(){ $("#btc").animate({color: "white"}, 3000) }, 3000); // fade back to white after 6 secs
            }
            else
            {
                $("#difference").css('color', '#FFFFFF');
                $("#change").attr('src','/img/assets/neutral.png')
            }
    }
    
    var fpsInterval, pTime, cTime, elapsed;
    
    // repaint the canvas at specified fps
    function animate(fps) {
        fpsInterval = 1000 / fps;
        
        pTime = Date.now();
        
        repaint();
    }
    
    // draw an image on the canvas
    function draw(img, scale, angle, x, y, opacity, callback) {
        c.save();
        c.translate(x, y);
        c.translate(img.width/2, img.height/2);
        c.rotate(Math.PI / 180 * (angle));
        c.scale(scale, scale);
        c.translate(-img.width/2, -img.height/2);
        c.globalAlpha = opacity;
        c.drawImage(img, 0, 0);
        c.restore();
        
        callback();
    }
    
    // draw text on the canvas
    function drawText(string, x, y, opacity, callback) {
        c.font = "1em Acme";
        c.shadowColor = "black";
        c.shadowOffsetX = 1;
        c.shadowOffsetY = 1;
        c.shadowBlur = 2;
        c.fillStyle = "white";
        c.globalAlpha = opacity;
        c.fillText(string, x, y);
        
        callback();
    }
    
    // repaint the canvas
    function repaint() {
        requestAnimationFrame(repaint);
        
        cTime = Date.now();
        
        elapsed = cTime - pTime;
        
        if (elapsed > fpsInterval) {
            pTime = cTime;
            
            bounce();
            updateWallets();
            updateStoreAvailability();
            dropCoins();
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight*0.37;
            
            c.clearRect(0, 0, canvas.width, canvas.height);
            
            let ratio = canvas.height/375;
            
            if (btcPerSec.compare("100000000") == 1) // 100 btc
            {
                draw(images[2], rays[5].scale*ratio, rays[5].angle, canvas.width/2 - images[2].width/2, canvas.height/2 - images[2].height/2, rays[5].opacity, function(){
                    rays[5].opacity += opacityShift/20;
                    rays[5].angle += rays[5].angleShift;
                    if (rays[5].opacity > 0.1 || rays[5].opacity < 0) 
                    {
                        opacityShift = -opacityShift;
                        rays[5].opacity = Math.max(0, rays[5].opacity);
                    }
                });
            }
            
            for (var i = 0; i < coins.length; i++)
            {
                let c = coins[i];
                
                draw(images[4], 0.35*ratio, c.ang, c.posx, c.posy, 1, function(){
                    c.ang += c.rvel;
                    c.yvel += 0.2*ratio;
                    c.posy += c.yvel;
                });
                
                if (c.posy > canvas.height)
                {
                    coins.splice(i, 1);
                    i--;
                }
            }
            
            if (btcPerSec.compare("1000000") == 1) // 1 btc
            {
                draw(images[1], rays[4].scale*ratio, rays[4].angle, canvas.width/2 - images[1].width/2, canvas.height/2 - images[1].height/2, rays[4].opacity, function(){
                    if (rays[4].opacity < 1)
                        rays[4].opacity += Math.abs(opacityShift);
                    if (rays[4].opacity > 1)
                        rays[4].opacity = 1;
                        
                    rays[4].angle += rays[4].angleShift;
                });
            }
            
            for (var i = 0; i < 4; i++)
            {
                draw(images[0], rays[i].scale*ratio, rays[i].angle, canvas.width/2 - images[0].width/2, canvas.height/2 - images[0].height/2, rays[i].opacity, function(){
                    rays[i].angle += rays[i].angleShift;
                });
            }
            
            draw(images[3], bigcoin.scale*ratio, 0, canvas.width/2 - images[3].width/2, canvas.height/2 - images[3].height/2, 1, function(){
            });

            for (var i = 0; i < clicknums.length; i++)
            {
                drawText(clicknums[i].value, clicknums[i].posX, clicknums[i].posY, clicknums[i].opacity, function() {
                    clicknums[i].posY -= 1*ratio;
                    clicknums[i].opacity -= 0.01;
                    if (clicknums[i].opacity <= 0)
                    {
                        clicknums.splice(i, 1);
                        i--;
                    }
                });
            }
        }
    }
    
    // bouncy effects for the bitcoin
    function bounce() {
        if (bigcoin.scale >= bigcoin.original + bigcoin.amplitude && bigcoin.flux == 1 || bigcoin.scale <= bigcoin.original - bigcoin.amplitude && bigcoin.flux == -1)
        {
            bigcoin.flux = -bigcoin.flux;
            bigcoin.amplitude -= bigcoin.amplitude/4 + 0.0001;
        }
        
        if (bigcoin.amplitude < 0)
        {
            bigcoin.amplitude = 0;
            bigcoin.scale = bigcoin.original;
        }
            
        else if (bigcoin.amplitude != 0)
            bigcoin.scale += 0.5*bigcoin.flux*bigcoin.amplitude;

        else if (bigcoin.scale != bigcoin.original)
        {
            bigcoin.scale += 0.02*bigcoin.flux;
            
            if (bigcoin.scale > bigcoin.original && bigcoin.flux == 1 || bigcoin.scale < bigcoin.original && bigcoin.flux == -1)
                bigcoin.scale = bigcoin.original;
        }
    }
    
    // add btc to wallet
    function addBTC(amount) {
        btcWallet = btcWallet.plus(amount);
    }
    
    // set btc wallet to an amount
    function setBTC(amount) {
        btcWallet = bigInt(amount);
    }
    
    // add btc per sec
    function addBTCPerSec(amount) {
        btcPerSec = btcPerSec.plus(amount);
        mod = btcPerSec.mod(20)/20;
        div = btcPerSec.divide(20);
        updatePerSec();
    }
    
    // set btc per sec
    function setBTCPerSec(amount) {
        btcPerSec = bigInt(amount);
        mod = btcPerSec.mod(20)/20;
        div = btcPerSec.divide(20);
        updatePerSec();
    }
    
    // calculate price of items in store based on item price and buy amount
    function calculatePrice(item) {
        let cost = items[item].price;
        let sum = bigInt(0);
            
        for (var i = 0; i < buyAmount; i++)
        {
            sum = sum.add(cost);
            cost = cost.multiply(12).divide(10);
        }
        
        return sum;
    }
    
    // determine if item can be bought and if so adjust game variables
    function processTransaction(item) {
        let wallet = (btcWallet).multiply(btcPrice*1000000).divide(1000000000000);
        let cost = calculatePrice(item);
        
        if (wallet.compare(cost) != -1)
        {
            items[item].amount += buyAmount;
            
            let usdtobtc = bigInt(1000000000000).divide(btcPrice)
            
            let expense = usdtobtc.multiply(cost).divide(1000000);
            
            addBTC(-expense);
            
            items[item].price = items[item].price.multiply(Math.pow(12, buyAmount)).divide(Math.pow(10, buyAmount));
            
            addBTCPerSec(items[item].generates.multiply(buyAmount));
            updateStoreItems();
        }
    }
    
    // update item availability (can or cannot be purchased or locked) of item based on wallet
    function updateStoreAvailability() {
        let wallet = (btcWallet).multiply(btcPrice*1000000).divide(1000000000000);
        
        for (var i = 0; i < items.length; i++)
        {
            let elem = $("#item" + (i+1));
            let cost = calculatePrice(i);
            
            if (cost.compare(wallet) == 1)
            {
                elem.addClass("unavailable");
                elem.removeClass("available");
            }
            else
            {
                elem.addClass("available");
                elem.removeClass("unavailable");
            }
            
            if (elem.hasClass("locked") && (wallet.compare(items[i].price.multiply(6).divide(10)) != -1) || items[i].amount > 0)
            {
                elem.removeClass("locked");
                $("#display"+(i+1)).fadeOut(400);
                $("#name"+(i+1)).html(items[i].name);
            }
        }
    }
    
    // update displayed amount of items and their price
    function updateStoreItems() {
        for (var i = 0; i < items.length; i++)
        {
            let cost = calculatePrice(i);
            $("#price"+(i+1)).html("$"+convertNumberName(formatBigNum(cost, "100"), 3));
            
            let elem = $("#amount"+(i+1));
            elem.html(items[i].amount);
                
            if (elem.hasClass("hide") && items[i].amount > 0)
                elem.removeClass("hide");
        }
    }
    
    // update displayed usd per sec and btc per sec
    function updatePerSec() {
        $("#persec").html(convertNumberName(formatBigNum(btcPerSec, "1000000"), 3));
        $("#usdpersec").html(convertNumberName(formatBigNum(convertToUSD(btcPerSec), "1000"), 3));
    }
    
    // change the headline for the news
    function updateNews() {
        let lines = [];
                     
        if (btcPerSec.compare(0) == 0) {
            lines.push("You are eager to venture into the world of cryptocurrencies");
            lines.push("You take the first steps to set up your crypto-portfolio");
        }
        else {
            lines.push("News : Yesterday, bitcoin was $" + (yesterdayPrice/100).toFixed(2));
            lines.push("Your favorite video game retail store no longer accepts bitcoin as payment much to your dismay");
            lines.push("You spend many hours every day looking at your crypto-portfolio");
            lines.push("You liquidate all your assets to invest more into bitcoin");
            lines.push("You firmly believe bitcoin will topple the world banks");
            
            if (convertToUSD(btcWallet).compare("100000000") == -1) {
            lines.push("Every night you dream of becoming a bitcoin millionaire");
            }
                        
            if (btcPrice - yesterdayPrice >= 30000)
                lines.push("News : BTC has surged from yesterday's price of $" + (yesterdayPrice/100).toFixed(2) + ", a change of +$" + ((btcPrice - yesterdayPrice)/100).toFixed(2));
                
            else if (btcPrice - yesterdayPrice <= -30000) {
                lines.push("News : BTC has plummeted from yesterday's price of $" + (yesterdayPrice/100).toFixed(2) + ", a change of -$" + ((yesterdayPrice - btcPrice)/100).toFixed(2));
                lines.push("You start to wonder if investing all your money in crypto was actually a good idea");   
            }
                
            if (items[3].amount > 10)
                lines.push("News : Local Best Buy ransacked of all GPUs");    
            
            if (items[3].price.compare(200000) == 1) {
                lines.push("News : Due to demand from bitcoin miners, the price of GPUs have soared up to $" + convertNumberName(formatBigNum(items[3].price, "100", false), 3) + " angering many gaming enthusiasts");
            }
            
            if (items[7].amount > 0)
                lines.push("News : Cults of bitcoin worshippers have sprung up in many areas of the country"); 
            
            if (items[5].amount > 0)
                lines.push("News : A bitcoin mining malware has infected millions of computers around the world");    
                
            if (items[8].amount > 0)
                lines.push("News : Experts warn that misusage of alien technology may have dire consequences");    
            else if (items[8].amount == 0 && !$("#item8").hasClass("locked"))
                lines.push("News : Strange devices have been found in South America, believed to be extraterrestrial");    
            
            if (items[10].amount > 0)
                lines.push("News : Newly found bitcoin dimension said to contain creatures made entirely out of bitcoin");
            
            if (items[11].amount > 0)
                lines.push("You lose the ability to differentiate between reality and the simulation");
                
            if (btcPerSec.compare(100000) == 1) {
                lines.push("The temperature in your house has reached 120°F");   
                lines.push("Your electricity bill has increased by 330% over the last month");
                lines.push("Your house has become a maze of mining equipment");
                lines.push("Your parents have disowned you due to your obsession with bitcoin");
            }
        }
                     
        $("#headline").fadeOut(1000, function() {
            $("#headline").html(lines[Math.floor(Math.random()*lines.length)]).fadeIn(1000);
        });
    }
    
    // change info in the box that appears when hovering over an item to match the item description
    function updateHoverBox(item) {
        $("#namehover").html(items[item].name);
        $("#pricehover").html("$"+convertNumberName(formatBigNum(calculatePrice(item), "100"), 3));
        $("#amounthover").html(items[item].amount);
        $("#infohover").html(items[item].description);
        $("#persechover").html("Each " + items[item].name + " produces <span style='color: #F7931A; font-size: 1.0em'>" + convertNumberName(formatBigNum(items[item].generates, "1000000"), 3) + 
        " BTC</span> per sec or <span style='color: #F7931A; font-size: 1.0em'>$" + convertNumberName(formatBigNum(convertToUSD(items[item].generates), "1000"), 3) + "</span> per sec");
        $("#totalhover").html(items[item].amount + " " + items[item].name + (items[item].amount == 1 ? "" : "s") + " producing <span style='color: #F7931A; font-size: 1.0em'>" + convertNumberName(formatBigNum(items[item].generates.multiply(items[item].amount), "1000000"), 3) + 
        " BTC</span> per sec or <span style='color: #F7931A; font-size: 1.0em'>$" + convertNumberName(formatBigNum(convertToUSD(items[item].generates).multiply(items[item].amount), "1000"), 3) + "</span> per sec");
    }
    
    // update displayed wallet amounts
    function updateWallets() {
        $("#btcwallet").html(convertNumberName(formatBigNum(btcWallet, "1000000"), 3));
        $("#usdwallet").html(convertNumberName(formatBigNum(btcWallet.multiply(btcPrice*1000000).divide(1000000000000), "100"), 3));
    }
    
    // drop coins in canvas
    function dropCoins() {
        if (delays[1] <= 0 && coins.length < 50)
        {
            coins.push({posx: window.innerWidth*Math.random() - images[4].width/2, posy: -images[4].height, ang: Math.random()*360, rvel: (Math.floor(Math.random()*2) % 2  == 0) ? Math.random()*5 + 0.1 : -(Math.random()*5) - 0.1, yvel: 1});
            delays[1] = 10000;
        }
    }
    
    // reset all sound effects
    function resetSound(callback) {
        for (var i = 0; i < soundEffects.length; i++)
        {
            soundEffects[i].pause();
            soundEffects[i].currentTime = 0;
        }
        
        callback();
    }
    
    // set up game
    function setUp(callback) {
        getData(true); 
        getData(false);
        loadProgress();
        updateStoreItems();
        
        // change volume of sound effects
        for (var i = 0; i < soundEffects.length; i++)
        {
            soundEffects[i].volume = 0.1; 
        }
        
        // fetch images for drawing
        images[0].src = '/img/canvas/rays_small.png';
        images[1].src = '/img/canvas/rays_large.png';
        images[2].src = '/img/canvas/rays_final.png';
        images[3].src = '/img/canvas/btc.png';
        images[4].src = '/img/canvas/coin.png';
        
        animate(60); // animate at 60 fps
        
        setTimeout(updateNews, 500);

        setInterval(function() {getData(true)}, 90000); // get data every 90 secs
        setInterval(saveProgress, 60000); // auto save progress every 60 secs
        setInterval(updateNews, 25000);
        setInterval(function() {
            delays[1] -= bigInt.min(btcPerSec, "10000");
            delays[0] -= 100;
            delays[2] -= 10;
        }, 100);
        setInterval(function() {
            document.title = convertNumberName(formatBigNum(btcWallet, "1000000"), 3) + " BTC - Bitcoin Miner";
        }, 2000); // update title every 2 secs
        
        callback();
    }
    
    // using a worker to allow btc to be accumulated in the background
    var worker = new Worker("/js/worker.js");
        
    var accum = 0;
    
    worker.onmessage = function(e) {
        // bigints can't add decimals, so accumulate the decimals each iteration until it reaches 1 and then add it
        accum += mod;
        
        addBTC(div);
        
        if (accum >= 1)
        {
            addBTC(1);
            accum = 0;
        }
    };
    
    // display loading screen until everything is loaded
    $(window).load(function() {
        setUp(function() {
            $('#page').css('display', 'block');
            $('#loading').css('display', 'none');
            bigcoin.amplitude = 0.08;
            bigcoin.original = 0.4;
            bigcoin.flux = -1;
            bigcoin.scale = 0;
        });
    });
    
    // event listeners
    
    $("#save").on("click", function() {
        saveProgress();
    })
    
    $("#reset").on("click", function() {
        $("#rnotif").removeClass("hide");
    })
    
    $("#ryes").on("click", function() {
        $("#rnotif").addClass("hide");
        reset();
    })
    
    $("#rno").on("click", function() {
        $("#rnotif").addClass("hide");
    })

    $("#coinclick").on("click", function(e) {
        let value = btcPerSec.multiply(4).divide(10).add(10);
        addBTC(value);
        bigcoin.original = 0.45;
        bigcoin.amplitude = 0.05;
        bigcoin.flux = 1;
        
        resetSound(function() {
            soundEffects[Math.floor(Math.random()*soundEffects.length)].play();
        });
        
        if (delays[0] <= 0)
        {
            let string = "+" + convertNumberName(formatBigNum(btcPerSec.multiply(4).divide(10).add(10), "1000000"), 3);
            c.font = "1em Acme";
            clicknums.push({value: string, posX: (Math.random()*2 % 2 == 0) ? e.pageX + Math.random()*10 - (c.measureText(string).width/2) : e.pageX - Math.random()*10 - (c.measureText(string).width/2), posY: e.pageY - canvas.height/2.2, opacity: 1.0});
            delays[0] = 150;
        }
        
        if (delays[2] <= 0)
        {
            coins.push({posx: window.innerWidth*Math.random() - images[4].width/2, posy: -images[4].height, ang: Math.random()*360, rvel: (Math.floor(Math.random()*2) % 2  == 0) ? Math.random()*5 + 0.1 : -(Math.random()*5) - 0.1, yvel: 1});
            delays[2]  = 300;
        }
    })
    
    $("#coinclick").on("mousedown", function() {
        bigcoin.original = 0.35;
        bigcoin.amplitude = 0;
        bigcoin.flux = -1;
    });
    
    $("#coinclick").on("mouseenter", function() {
        bigcoin.original = 0.45;
        bigcoin.amplitude = 0.04;
    });
    
    $("#coinclick").on("mouseleave", function(e) {
        if (e.relatedTarget != null) // event misfiring in chrome fix
        {
            bigcoin.original = 0.4;
            bigcoin.amplitude = 0.03;
        }
    });
    
    // store stuff
    $("#buy1").on("click", function() {
        buyAmount = 1;
        $("#buy1").addClass("selected");
        $("#buy5").removeClass("selected");
        $("#buy10").removeClass("selected");
        updateStoreItems();
    });
    
    $("#buy5").on("click", function() {
        buyAmount = 5;
        $("#buy5").addClass("selected");
        $("#buy1").removeClass("selected");
        $("#buy10").removeClass("selected");
        updateStoreItems();
    });
    
    $("#buy10").on("click", function() {
        buyAmount = 10;
        $("#buy10").addClass("selected");
        $("#buy1").removeClass("selected");
        $("#buy5").removeClass("selected");
        updateStoreItems();
    });
    
    function onclick_handler(k) {
        return function(event) {
            if (!$("#item" + (k+1)).hasClass("locked"))
            {
                processTransaction(k);
                updateHoverBox(k);
            }
        };
    }
    
    function onmouseenter_handler(k) {
        return function(event) {
            if (!$("#item" + (k+1)).hasClass("locked"))
            {
                $("#itemhover").removeClass("hide");
                updateHoverBox(k);
            }
        };
    }
    
    function onmousemove_handler(k) {
        return function(event) {
            (event.pageX < window.innerWidth - ($("#itemhover").width()+4)) ? $("#itemhover").css("left", event.pageX) : $("#itemhover").css("left", window.innerWidth - ($("#itemhover").width()+4));
            (event.pageY < window.innerHeight - ($("#itemhover").height()+4)) ? $("#itemhover").css("top", event.pageY) : $("#itemhover").css("top", window.innerHeight - ($("#itemhover").height()+4));
        };
    }
    
    function onmouseleave_handler(k) {
        return function(event) {
            if (event.relatedTarget != null) // event misfiring in chrome fix
            {
                $("#itemhover").addClass("hide");
            }
        };
    }
    
    // apply each event handler to each store item
    for (var i = 0; i < items.length; i++)
    {
        let elem = $("#item"+(i+1));
        elem.on("click", onclick_handler(i));
        elem.on("mouseenter", onmouseenter_handler(i));
        elem.on("mousemove", onmousemove_handler(i));
        elem.on("mouseleave", onmouseleave_handler(i));
    }
    
});