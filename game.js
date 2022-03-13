//////////
// TOWN //
//////////

statuses = [["Town", 0],
			["Suburb", 5000],
			["Minor City", 10000],
			["City", 100000],
			["Major City", 1000000],
			["State Capital", 5000000],
			["Country Capital", 10000000],
			["State", 25000000],
			["Country", 500000000],
			["Continent", 1000000000],
			["Planet", 10000000000]];

function Town(name) {
	this.name = name;
	this.time = 0;
	this.population = 10;
	this.populationGrowth = 1;
	this.money = 100000
	this.income = 50000
	this.status = 0;
};	

function abbreviate(value) {
	if (Math.abs(value) >= 1000000000000) return (Math.floor(value/100000000000)/10) + "T";
	if (Math.abs(value) >= 1000000000) return (Math.floor(value/100000000)/10) + "B";
	if (Math.abs(value) >= 1000000) return (Math.floor(value/100000)/10) + "M";
	if (Math.abs(value) >= 1000) return (Math.floor(value/100)/10) + "K";
	else return value;
}

function update(town) {
	document.getElementById("status").innerText = town.name + " (" + statuses[town.status][0] + ")";
	document.getElementById("time").innerText = "Established for " + town.time + " year(s)";
	document.getElementById("population").innerText = "Population: " + abbreviate(town.population);
	document.getElementById("populationGrowth").innerText = "Population Growth Rate: " + abbreviate(town.populationGrowth) + " / year";
	document.getElementById("money").innerText = "Money: $" + abbreviate(town.money);
	document.getElementById("income").innerText = "Income: $" + abbreviate(town.income) + " / year";
	if (town.status < (statuses.length-1)) document.getElementById("progress").innerText =
						("Progress to " + statuses[town.status + 1][0] + ": " + Math.floor((town.population/statuses[town.status + 1][1]) * 100) + "%");
	else document.getElementById("progress").innerText = "Maximum Level!";
}

function age(town) {
	if (refreshMarketTimeout > 0) refreshMarketTimeout--;
	town.population += town.populationGrowth;
	town.money += town.income;
	town.time++;
	if (town.population < 0) town.population = 0;
	if (town.money < 0) town.money = 0;
	while ((town.status < (statuses.length-1)) &&
		(town.population >= statuses[town.status + 1][1])) {
		town.status++;
		alert("Your " + statuses[town.status-1][0] + " has leveled up to a " + statuses[town.status][0] + "!");
		if (town.status == (statuses.length-1)) {
			alert(`You've won the game! If you want, you can keep playing to keep expanding your city. If you want to play again, you can restart the page and start from scratch again. You finished in ${town.time} years. Can you finish faster?`);
		}
	}
	update(town);
}

///////////////
// BUILDINGS //
///////////////

var Building = function Building(name, cost, pop, popGrow, income,
								type, stock) {
	this.name = name;
	this.stock = stock;
	this.type = type;
	this.cost = cost;
	this.pop = pop
	this.popGrow = popGrow
	this.income = income;
}

var buildings = [
[
	new Building("Cottage", 5000, 5, 1, 100, "Residential", 50),
	new Building("House", 100000, 10, 5, 1000, "Residential", 25),
	new Building("Trailer Park", 150000, 50, 5, 2500, "Residential", 3),
	new Building("Homeless Shelter", 100000, 50, 10, -10000, "Residential", 3),
	new Building("Farmer's Market", 5000, 0, 10, 1000, "Commercial", 10),
	new Building("General Store", 10000, 0, 0, 2500, "Commercial", 10),
	new Building("Motel", 150000, 0, 10, 2500, "Commercial", 5), 
	new Building("Park", 50000, 0, 10, -1000, "Community", 3),
	new Building("Local Garden", 2500, 0, 10, -250, "Community", 5),
	new Building("Small Playground", 1000, 0, 5, -100, "Community", 10),
	new Building("Large Playground", 5000, 0, 25, -500, "Community", 5)
],
[
	new Building("Apartment", 2500000, 1000, 250, 25000, "Residential", 50),
	new Building("Street Houses", 1000000, 100, 50, 5000, "Residential", 25),
	new Building("Office", 5000000, 0, 10, 50000, "Commercial", 50),
	new Building("Fast Food Restaurant", 1000000, 0, 0, 10000, "Commercial", 25),
	new Building("Fancy Restaurant", 2500000, 0, 25, 50000, "Commercial", 10),
	new Building("Grocery Store", 10000000, 0, 250, 75000, "Commercial", 5),
	new Building("Hotel", 5000000, 100, 250, 25000, "Commercial", 5),
	new Building("Preschool", 2500000, 0, 100, 10000, "Community", 25),
	new Building("Elementary School", 10000000, 0, 250, -50000, "Community", 50),
	new Building("Middle School", 15000000, 0, 500, -100000, "Community", 25)
],
[
	new Building("Neighborhood", 2500000000, 5000, 2500, 100000, "Residential", 50),
	new Building("Company HQ", 1000000000, 0, 1000, 1000000, "Commercial", 10),
	new Building("Movie Theater", 500000000, 0, 500, 1000000, "Commercial", 5),
	new Building("Local Airport", 1000000000, 0, 5000, 2500000, "Commercial", 1),
	new Building("International Airport", 10000000000, 0, 5000, 10000000, "Commercial", 1),
	new Building("Nuclear Plant", 10000000000, 0, -10000, 10000000, "Commercial", 5),
	new Building("Hospital", 15000000000, 0, 25000, 10000000, "Commercial", 5),
	new Building("Amusement Park", 5000000000, 0, 1000, 1000000, "Community", 3),
	new Building("High School", 100000000, 0, 5000, -1000000, "Community", 10),
	new Building("University", 250000000, 0, 10000, 10000000, "Community", 5)
]
];

/////////////////////
// BUILDING MARKET //
/////////////////////

var Offer = function Offer(tier, slot, node) {
	this.tier = tier;
	this.slot = slot;
	this.node = node;
}

Offer.prototype.updateInfo = function(building) {
	this.building = building;
	this.name = building.name;
	this.cost = building.cost;
	this.stock = building.stock;
	this.pop = building.pop;
	this.popGrow = building.popGrow;
	this.income = building.income;
	this.type = building.type;
	this.configureNode();
}

Offer.prototype.configureNode = function() {
	let info = this.node.childNodes;
	info[1].innerText = this.name;
	info[3].innerText = "Cost: $" + abbreviate(this.cost);
	info[5].innerText = "Stock: " + this.stock;
	info[7].innerText = "Population Bonus: " + abbreviate(this.pop);
	info[9].innerText = "Population Growth Bonus: " + abbreviate(this.popGrow);
	info[11].innerText = "Income Bonus: " + abbreviate(this.income);
	let buy1 = "market[" + this.tier + "][" + this.slot + "].buy(1)";
	let buy10 = "market[" + this.tier + "][" + this.slot + "].buy(10)";
	let buyAll = "market[" + this.tier + "][" + this.slot + "].buy(" + this.stock + ")";
	let buyMax = "market[" + this.tier + "][" + this.slot + "].buy('max')";
	info[13].setAttribute("onclick", buy1);
	info[15].setAttribute("onclick", buy10);
	info[17].setAttribute("onclick", buyAll);
	info[19].setAttribute("onclick", buyMax);
	this.node.className = "offer " + this.type;
	info[13].className = this.type + "Button";
	info[15].className = this.type + "Button";
	info[17].className = this.type + "Button";
	info[19].className = this.type + "Button";
}

Offer.prototype.buy = function(amount) {
	if (amount == "max") amount = Math.min(Math.floor(town.money/this.cost), this.stock);
	if (!this.stock) {
		alert("This building is out of stock!");
		return;
	}
	if (this.stock < amount) {
		alert("There aren't enough buildings available!");
		return;
	}
	if ((this.cost * amount) > town.money) {
		alert("You can't afford this purchase!");
		return;
	}
	town.money -= (this.cost * amount);
	this.stock -= amount;
	town.population += (this.pop * amount);
	town.populationGrowth += (this.popGrow * amount);
	town.income += (this.income * amount);
	this.configureNode();
	update(town);
};

var market = [];
var refreshMarketTimeout = 0;

function initialize() {
	let template = document.getElementById("offerTemplate");
	template.removeAttribute("id");
	for (let g = 0; g < 3; g++) {
		market[g] = [];
		let offers = newOffers(g);
		for (let h = 0; h < 3; h++) {
			market[g][h] = new Offer(g, h, template.cloneNode([true]));
			market[g][h].updateInfo(offers[h]);
			document.getElementById("tier" + (g+1)).appendChild(market[g][h].node);
		}
	}
	document.getElementById("market").removeChild(template);
}

function updateMarket() {
	for (let g = 0; g < 3; g++) {
		for (let h = 0; h < 3; h++) {
			market[g][h].updateInfo(market[g][h].building);
		}
	}
}

function refresh() {
	if (!refreshMarketTimeout) {
		refreshMarketTimeout = 3;
	} else {
		alert("Wait " + refreshMarketTimeout + " more year(s) to refresh the market!");
		return;
	}
	for (let g = 0; g < 3; g++) {
		let offers = newOffers(g);
		for (let h = 0; h < 3; h++) {
			market[g][h].updateInfo(offers[h]);
		}
	}
};

function newOffers(tier) {
	let buildingOffers = [];
	function shuffle(array) {
		array.sort(() => Math.random() - 0.5);
	}
	shuffle(buildings[tier]);
	buildingOffers.push(buildings[tier][0]);
	buildingOffers.push(buildings[tier][1]);
	buildingOffers.push(buildings[tier][2]);
	return buildingOffers;
}

//////////////
// START-UP //
//////////////

var town = new Town("My City");
update(town);
initialize();

setTimeout(function() { 
	let name = prompt("Welcome to the City Simulator! What will you name your city?");
	town.name = (name ? name : "My City");
	update(town);
}, 100);