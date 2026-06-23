const products=[

{

name:"Laptop",

price:59999,

category:"Electronics",

image:"https://img.magnific.com/free-photo/laptop-with-sun-background_1232-429.jpg?semt=ais_hybrid&w=740&q=80"

},

{

name:"Headphones",

price:2999,

category:"Accessories",

image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_DBvTzWQX9lXu9WeyStG8wkSHWXLq3_Iupw&s"

},

{

name:"Smart Watch",

price:4999,

category:"Wearables",

image:"https://t4.ftcdn.net/jpg/06/60/68/37/360_F_660683718_qo0q1V2RuLO56S7cu4VMb078m10U6WW8.jpg"

},

{

name:"Camera",

price:24999,

category:"Electronics",

image:"https://img.magnific.com/free-psd/black-dslr-camera-with-lens_530521-1824.jpg?semt=ais_hybrid&w=740&q=80"

}

];

const productContainer=

document.getElementById(

"productContainer"

);

const searchInput=

document.getElementById(

"searchInput"

);

const cartCount=

document.getElementById(

"cartCount"

);

const darkMode=

document.getElementById(

"darkMode"

);

let cart=0;

function displayProducts(data){

productContainer.innerHTML="";

data.forEach(product=>{

productContainer.innerHTML+=`

<div class="card">

<img

src="${product.image}"

loading="lazy">

<h3>

${product.name}

</h3>

<p>

${product.category}

</p>

<h2>

₹${product.price}

</h2>

<button>

Add To Cart

</button>

</div>

`;

});

addCartButtons();

}

function addCartButtons(){

const buttons=

document.querySelectorAll(

".card button"

);

buttons.forEach(button=>{

button.addEventListener(

"click",

()=>{

cart++;

cartCount.innerText=cart;

}

);

});

}

displayProducts(products);

searchInput.addEventListener(

"input",

()=>{

const value=

searchInput.value

.toLowerCase();

const filtered=

products.filter(product=>

product.name

.toLowerCase()

.includes(value)

);

displayProducts(filtered);

}

);

darkMode.addEventListener(

"click",

()=>{

document.body

.classList.toggle("dark");

}

);