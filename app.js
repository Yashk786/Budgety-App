/* var budgetController = (function () {

    var x = 23;

    var add = function (a) {
        return x + a;
    }
    return {
        publicTest: function (b) {
            return add(b);
        }
    }

})();

var UIController = (function () {

    //Some code
})();

//We need a way to read data from UI and add that data as a new expanse in the budgetController. and that why we create our thir module controller below.

// We pass other two modules as arguments in this controller module so that this controller knows about the othr tows and connect them.

//So when we call this fuctions[(function (budgetCtrl, UICtrl)] , we can pass our arguments in function in end();

//And we want our created budgetCtrl so this one here at end [(budgetController,)] we assigned to the budgetCtrl , so in our controller module it will have a different name and same with UI controller(budgetController,UIController).

var controller = (function (budgetCtrl, UICtrl) {
 
    var z = budgetCtrl.publicTest(5);

    return {
        anotherPublic : function(){
            console.log(z);
        }
    }

})(budgetController,UIController); */




//Start our project ****************
/**************/


//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;

    };

    Expense.prototype.calculatePercentages = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentages = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculatTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        /*
        sum = 0;
        [200,300,400]
        sum = 0 + 200
        sum = 200 + 400
        sum = 600 + 700
        */

        data.totals[type] = sum;
    };


    var data = {
        allItems: {
            exp: [],

            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem, Id;

            //Create new ID
            if (data.allItems[type].length > 0) {
                Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                Id = 0;
            }

            //Creat new itm based on 'inc' or 'exp'
            if (type === 'exp') {
                newItem = new Expense(Id, des, val)
            } else if (type === 'inc') {
                newItem = new Income(Id, des, val)
            }

            //Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new Element
            return newItem;

        },

        deleteItem: function (type, id) {

            var ids, index;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);

            }


        },

        calculateBudget: function () {

            //Calculate total income and expenses
            calculatTotal('exp');
            calculatTotal('inc');

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

            // Expense = 100 and income 200 , spent 50% = 100/200 = 0.5 * 100,


        },

        calculatePercentages: function () {

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });


        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentages();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };

        },

        testing: function () {
            console.log(data);

        }
    };
})();


// UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        expensesContainer: '.expenses__list',
        incomesContainer: '.income__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container'
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, element, newHtml;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomesContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace th placeholder text with some actual data

            newHtml = html.replace('%id', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into DOM

            document.querySelector(element).insertAdjacentHTML('afterend', newHtml);

        },

        deleteListItem: function (selectorID) {

            var el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);

        },

        clearFields: function () {
            var fields;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue)

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";

            });

            fieldsArr[0].focus();

        },

        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLable).textContent = '----';

            }

        },


        getDOMstrings: function () {
            return DOMstrings;

        }
    };

})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        //This keypress event does not happen on any specific element but it happens on the global webpage
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();

            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeletetem);

    };

    var updateBudget = function () {


        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function () {

        //1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        console.log(percentages);


    };


    var ctrlAddItem = function () {
        var input, newItem;

        //1. Get the filed input data
        input = UICtrl.getInput();

        if (input.Description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear input fields
            UICtrl.clearFields();

            // 5. Calculate and update the budget 
            updateBudget();

            // 6. Calculate and update the percentages

        }

    };

    var ctrlDeletetem = function (event) {

        var itemID, splitId, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //inc -1
            splitId = itemID.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);

            //1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            //2. Delte the item from the UI
            UICtrl.deleteListItem(itemID);

            //3. Update and show the new budget
            updateBudget();

            //4. Calculate and update the percentages
        }

    };

    return {
        init: function () {
            console.log('Application has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListeners();
        }
    };




})(budgetController, UIController);

controller.init();