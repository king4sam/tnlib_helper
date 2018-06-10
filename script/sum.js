export default function sum(initial, ...value){
  return value.reduce((total,value) => total + value, initial);
}