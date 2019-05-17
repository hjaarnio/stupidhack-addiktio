const fruits = [
"Apple",
"Apricot",
"Avocado",
"Banana",
"Blueberry",
"Blackberry",
"Cherry",
"Cranberry",
"Cucumber",
"Eggplant",
"Grape",
"Grapefruit",
"Honeydew",
"Kiwi",
"Lemon",
"Lime",
"Mango",
"Nectarine",
"Olive",
"Orange",
"Papaya",
"Peach",
"Pear",
"Pineapple",
"Plum",
"Pomegranate",
"Raspberry",
"Strawberry",
"Tangerine",
"Tomato",
"Watermelon",
]

export default () => {
  return (
    fruits[Math.floor(fruits.length * Math.random())] +
    fruits[Math.floor(fruits.length * Math.random())] +
    fruits[Math.floor(fruits.length * Math.random())] +
    fruits[Math.floor(fruits.length * Math.random())]
  )
}
