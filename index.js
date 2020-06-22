// solutions here
const lib = require('./lib/lib.js');
const events = require('events');
//1. Asynchronous Operations
// {
//     const asyncOp = lib.asyncOp;
//     /**
//      * @param {Array} taskArr
//      */
//     async function doAsync(taskArr, num) {
//         // //A. Mehhh method without using async/await.
//         // const callback = (iterArg) => () => {
//         //     const task = iterArg.next().value;
//         //     let promise;
//         //     if (task) {
//         //         if (Array.isArray(task)) {
//         //             const promiseArr = task.map(subTask => asyncOp(subTask));
//         //             promise = Promise.all(promiseArr);
//         //         } else {
//         //             promise = asyncOp(task);
//         //         }
//         //         promise.then(callback(iterArg));
//         //     }
//         // };

//         // const iter = arr[Symbol.iterator]();
//         // asyncOp(iter.next().value, callback(iter));

//         // //B. Async/Await Method if asyncOp was async
//         // for (const task of taskArr) {
//         //     const isAnArrayOfTasks = Array.isArray(task);
//         //     if (isAnArrayOfTasks) {
//         //         const promiseArr = task.map(subTask => asyncOp(subTask));
//         //         await Promise.all(promiseArr);
//         //     }
//         //     else {
//         //         await asyncOp(task);
//         //     }
//         // }

//         //C. Workaround for if asyncOp isn't async
//         console.log(`starting async function ${num}`);
//         async function promisedAsyncOp(task) {
//             return new Promise(resolve => asyncOp(task, resolve));
//         }
        
//         for (let task of taskArr) {
//             if (Array.isArray(task)) {
//                 await Promise.all(task.map(subtask => promisedAsyncOp(subtask)));
//             } else {
//                 await promisedAsyncOp(task);
//             }
//         }
//         console.log(`finished async function ${num}`);
//     }

//     const input1 = [
//         'A',
//         [ 'B', 'C' ],
//         'D'
//     ];

//     const input2 = [
//         'A',
//         [ 'B', 'C', 'D', 'E' ],
//         'F',
//         'G',
//         [ 'H', 'I' ]
//     ];

//     doAsync(input1, 1);
//     // doAsync(input2, 2);
// }

//2. Streams
class RandStringSource extends events.EventEmitter {
    constructor(randStream) {
        this.randStream = randStream;
    }
}

const RandStream = lib.RandStream;
let source = new RandStringSource(new RandStream());

source.on('data', (data) => {
  console.log(data);
});

// source.emit('data', source.randStream)
