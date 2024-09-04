import { useEffect, useState, useMemo } from "react"
import { db } from "../data/db"
import { Guitar, CartItem } from "../types"

export default function useCart() {

  const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data, setData] = useState<Guitar[]>([])
  const [cart, setCart] = useState(initialCart)

  useEffect(() => {
    setData(db)
  }, [])

  const MAX_QUANTITY = 12
  const MIN_QUANTITY = 1

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addCart(item : Guitar) {

    const isGuitarExist = cart.findIndex( guitar => guitar.id === item.id)

    if(isGuitarExist >= 0 ) {
      if(cart[isGuitarExist].quantity >= MAX_QUANTITY) return
      const updateCart = [...cart]
      updateCart[isGuitarExist].quantity++
      setCart([...updateCart])
    } else {
      const newItem : CartItem = {...item, quantity: 1 }
      setCart( prevCart => [...prevCart, newItem])
    }
  }

  function removeFromCart(id : Guitar['id']) {
    setCart(cart.filter(guitar => guitar.id !== id))
  }

  function increaseQuantity(id : Guitar['id']) {
    const updateCart = cart.map( guitar => {
      if(guitar.id === id && guitar.quantity < MAX_QUANTITY) {
        return {
          ...guitar,
          quantity: guitar.quantity + 1
        }
      }
      return guitar
    })
    setCart(updateCart)
  }

  function decreaseQuantity(id : Guitar['id']) {
    const updateCart = cart.map( guitar => {
      if(guitar.id === id && guitar.quantity > MIN_QUANTITY) {
        return {
          ...guitar,
          quantity: guitar.quantity - 1
        }
      }
      return guitar
    })
    setCart(updateCart)  
  }

  function resetCart() {
    setCart([])
  }

  const cartEmpty = useMemo(() => cart.length === 0, [cart])
  const cartPay = useMemo(() => cart.reduce( (acc, {price, quantity}) =>  acc + price * quantity, 0), [cart])

  return {
    data,
    cart,
    addCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    resetCart,
    cartEmpty,
    cartPay
  }
}
