console.log('Start');

// This blocks for 3 seconds
const start = Date.now();
while (Date.now() - start < 3000) {
    // Blocking loop
}

console.log('End'); // Runs

// ✅ Asynchronous - non-blocking
console.log('Start-2');

// This doesn't block
setTimeout(() => {
    console.log('Async operation done');
}, 3000);

console.log('End-2'); // Runs immediately
// Output: Start, End, Async operation done
// Total time: ~0 seconds to reach 'End'


// worker-pizza.js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    // Main thread - Pizza shop
    console.log('🍕 Starting pizza shop with multiple chefs');
    
    const pizzas = ['Margherita', 'Pepperoni', 'Hawaiian'];
    
    pizzas.forEach(pizza => {
        const worker = new Worker(__filename, {
            workerData: { pizzaName: pizza }
        });
        
        worker.on('message', (msg) => {
            console.log(msg);
        });
    });
    
    console.log('🏪 Shop serving customers while chefs work');
} else {
    // Worker thread - Individual chef
    const { pizzaName } = workerData;
    
    parentPort.postMessage(`👨‍🍳 Chef started making ${pizzaName}`);
    
    // Simulate cooking time
    setTimeout(() => {
        parentPort.postMessage(`✅ ${pizzaName} pizza ready!`);
    }, 3000);
}