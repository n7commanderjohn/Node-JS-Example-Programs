// solutions here
const lib = require('./lib/lib.js');
const events = require('events');
// {
//    //1. Asynchronous Operations
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

{
    //2. Streams
    class RandStringSource extends events.EventEmitter {
        constructor(randStream, maxNumberOfEmits) {
            super();
            this.randStream = randStream;
            this.numberOfEmits = 0;
            this.maxNumberOfEmits = maxNumberOfEmits;
            this.emitForRead();
        }

        emitForRead() {
            const randString = this.randStream.read();
            const isValidData = randString && (randString.indexOf('.') != -1);
            const isUnderMax = this.numberOfEmits < this.maxNumberOfEmits;
            const hasMaxNumberOfEmits = this.maxNumberOfEmits;
            const willRun =  isUnderMax || !hasMaxNumberOfEmits;

            if (isValidData && willRun) {
                const seperator = '***************************************';
                console.log(seperator);
                console.log(`Emit Number #${++this.numberOfEmits}`);
                console.log(`Full Chunk: ${randString}`);

                this.emitChunk(randString);

                console.log(seperator);
            }
            if (willRun) 
                setTimeout(() => {
                    this.emitForRead();
                }, 1);
            else {
                console.log(`Emitted max number of times as defined: ${this.maxNumberOfEmits}`);
                process.exit();
            }
        }

        emitChunk(randString) {
            const segments = randString.split('.');
            for (const segment in segments) {
                const position = 1 + Number(segment);
                const value = segments[segment];

                this.emit('data', `Segment #${position}: ${value}`);
            }
        }
    }

    const RandStream = lib.RandStream;
    let source = new RandStringSource(new RandStream(), 10);

    source.on('data', (data) => {
        console.log(data);
    });
}
