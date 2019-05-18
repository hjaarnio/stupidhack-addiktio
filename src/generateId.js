const fruits = [
"apple",
"apricot",
"avocado",
"banana",
"blueberry",
"blackberry",
"cherry",
"cranberry",
"cucumber",
"eggplant",
"grape",
"grapefruit",
"honeydew",
"kiwi",
"lemon",
"lime",
"mango",
"nectarine",
"olive",
"orange",
"papaya",
"peach",
"pear",
"pineapple",
"plum",
"pomegranate",
"raspberry",
"strawberry",
"tangerine",
"tomato",
"watermelon",
]

export default () => {
  return (
    fruits[Math.floor(fruits.length * Math.random())] + '.' +
    fruits[Math.floor(fruits.length * Math.random())] + '.' +
    fruits[Math.floor(fruits.length * Math.random())] + '.' +
    fruits[Math.floor(fruits.length * Math.random())]
  )
}
