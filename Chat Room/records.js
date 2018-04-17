const {EventEmitter} = require("events");
const mongoose = require('./db-connector');
const schema = require('./schema');

const Message = mongoose.model('Message', schema);

let instance;
let data = [];
let MAX = 50;

class Records extends EventEmitter {
    constructor () {
        super();
    }

    push (msg) {

        const m = new Message(msg);

        m.save();

        this.emit("new_message", msg);
        
        Message.count().then((count) => {
            if (count >= MAX) {
                Message.find().sort({'time': 1}).limit(1).then((res) => {
                    Message.findByIdAndRemove(res[0]._id);
                });
            }
        });
    }
    
    get (callback) {
        Message.find((err, msgs) => {
            callback(msgs);
        });
    }

    setMax (max) {
        MAX = max;
    }

    getMax () {
        return MAX;
    }
}

module.exports = (function () {
    if (!instance) {
        instance = new Records();
    }

    return instance;
})();