interface ShoppingCart {}

// High-level module
class ShoppingCartService {
    constructor(private paymentProcessor: IPaymentProcessor) {}

    checkout(cart: ShoppingCart) {
        return this.paymentProcessor.processPayment(cart);
    }
}

// Abstraction
interface IPaymentProcessor {
    processPayment(cart: ShoppingCart): void;
}

// Implementation of the abstraction (
class StripePaymentProcessor implements IPaymentProcessor {
    processPayment(cart: ShoppingCart): void {
        // Use the Stripe API to process the payment for the items in the shopping cart
    }
}

// Now the ShoppingCartService depends on the abstraction, not the implementation
const shoppingCartService = new ShoppingCartService(new StripePaymentProcessor());



interface AnimalCanWalk {
    walk(): void;
}

interface AnimalCanFly {
    fly(): void;
}

class Dog implements AnimalCanWalk {
    walk() {
        console.log("Walking");
    }
}

class Duck implements AnimalCanWalk, AnimalCanFly {
    walk() {
        console.log("Walking");
    }

    fly() {
        console.log("Flying");
    }
}

class Rectangle {
    width: number
    height: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    public setWidth(width) {
        this.width = width;
    }
    public setHeight(height) {
        this.height = height;
    }
    public getArea() {
        return this.width * this.height;
    }
}

class Square extends Rectangle {
    constructor(width: number) {
        super(width, width)
    }
    public override setWidth(width) {
        this.width = width;
        this.height = width;
    }
    public override setHeight(height) {
        this.height = height;
        this.width = height;
    }
}


const rect: Rectangle = new Square(10)
rect.setHeight(5)
rect.getArea() // 25


import { ref, onMounted } from 'vue'

export const useSorting = (items) => {
    const sortOrder = ref('ascending')
    const sortedItems = ref([])

    function toggleSortOrder () {
        sortOrder.value = sortOrder.value === 'ascending' ? 'descending' : 'ascending'
    }

    onMounted(() => {
        sortedItems.value = items.value.sort((a, b) => {
            if (sortOrder.value === 'ascending') {
                return a.text.localeCompare(b.text)
            } else {
                return b.text.localeCompare(a.text)
            }
        })
    })

    return { sortOrder, sortedItems, toggleSortOrder }
}
