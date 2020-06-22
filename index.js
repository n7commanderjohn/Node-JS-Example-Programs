// solutions here
const progArgs = process.argv.slice(2);
const solutionNum = progArgs[0] ? Number(progArgs[0]) : 1;

const lib = require('./lib/lib.js');
const events = require('events');

console.log(`***    Executing solution #${solutionNum}...   ***`);

switch (solutionNum) {
    case 1:
        executeSolution1();
        break;
    case 2:
        executeSolution2();
        break;
    case 3:
        executeSolution3();
        break;
    default:
        executeSolution1();
        break;
}

//1. Asynchronous Operations
function executeSolution1() {
    const asyncOp = lib.asyncOp;
    /**
     * @param {Array} taskArr
     */
    async function doAsync(taskArr, num, methodNum = 3) {

        //A. Mehhh method without using async/await.
        if (methodNum == 1) {
            const callback = (iterArg) => () => {
                const task = iterArg.next().value;
                let promise;
                if (task) {
                    if (Array.isArray(task)) {
                        const promiseArr = task.map(subTask => asyncOp(subTask));
                        promise = Promise.all(promiseArr);
                    } else {
                        promise = asyncOp(task);
                    }
                    promise.then(callback(iterArg));
                }
            };

            const iter = taskArr[Symbol.iterator]();
            asyncOp(iter.next().value, callback(iter));
        }   

        //B. Async/Await Method if asyncOp was async
        else if (methodNum == 2) {
            for (const task of taskArr) {
                const isAnArrayOfTasks = Array.isArray(task);
                if (isAnArrayOfTasks) {
                    const promiseArr = task.map(subTask => asyncOp(subTask));
                    await Promise.all(promiseArr);
                }
                else {
                    await asyncOp(task);
                }
            }
        }
        
        //C. Workaround for if asyncOp isn't async
        else if (methodNum == 3) {
            console.log(`starting async function ${num}`);
            async function promisedAsyncOp(task) {
                return new Promise(resolve => asyncOp(task, resolve));
            }
    
            for (let task of taskArr) {
                if (Array.isArray(task)) {
                    await Promise.all(task.map(subtask => promisedAsyncOp(subtask)));
                }
                else {
                    await promisedAsyncOp(task);
                }
            }
            console.log(`finished async function ${num}`);
        }
    }

    const input1 = [
        'A',
        ['B', 'C'],
        'D'
    ];

    const input2 = [
        'A',
        ['B', 'C', 'D', 'E'],
        'F',
        'G',
        ['H', 'I']
    ];

    doAsync(input1, 1);
    // doAsync(input2, 2);
}

//2. Streams
function executeSolution2() {
    const maxNumberOfEmits = progArgs[1] ? progArgs[1] : 3;
    console.log(`Will emit ${maxNumberOfEmits} times...`);
    const seperator = '***************************************';
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
            const isUnderMax = this.numberOfEmits < this.maxNumberOfEmits || this.maxNumberOfEmits == 0;
            const hasMaxNumberOfEmits = this.maxNumberOfEmits;
            const willRun = isUnderMax || !hasMaxNumberOfEmits;

            if (isValidData && willRun) {
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
                console.log(`Emitted ${this.maxNumberOfEmits} times.`);
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
    const source = new RandStringSource(new RandStream(), maxNumberOfEmits);

    source.on('data', (data) => {
        console.log(data);
    });
}

//3. Resource Pooling
function executeSolution3() {
    class ResourceManager {
        constructor(maxResourceCount) {
            this.activeResources = [];
            this.pendingResources = [];
            this.resourceIdCount = 0;
            this.maxResourceCount = maxResourceCount;
        }

        createResource(resourceManager) {
            return {
                id: ++resourceManager.resourceIdCount,
                release: function() {
                    const resources = resourceManager.activeResources;
                    const resourceIndex = resources.findIndex(r => r.id == this.id);

                    resources.splice(resourceIndex, 1);
                    console.log(`released resource #${this.id}`);
                }
            }
        }

        borrow(callback) {
            if (this.activeResources.length < this.maxResourceCount) {
                const resource = this.createResource(this);
                this.activeResources.push(resource);
                callback(resource);
            }
            else {
                // const resource = this.createResource(this);
                // if (!this.pendingResources.find(r => r.id == resource.id)) {
                //     this.pendingResources.push(resource);
                // }
                setTimeout(() => {
                    this.borrow(callback)
                }, 500);
            }
        }
    }

    const pool = new ResourceManager(2);
    console.log('START');

    const timestamp = Date.now();

    const releaseTimed = (res, time = 500) => {
        setTimeout(() => {
            res.release();
        }, time);
    };

    pool.borrow((res) => {
        console.log('RES: 1');
        releaseTimed(res);
    });

    pool.borrow((res) => {
        console.log('RES: 2');
        releaseTimed(res);
    });

    pool.borrow((res) => {
        console.log('RES: 3');
        releaseTimed(res);
    });

    pool.borrow((res) => {
        console.log('RES: 4');
        console.log('DURATION: ' + (Date.now() - timestamp));
        releaseTimed(res);
    });
    // console.log('Executed solution 3');
}
