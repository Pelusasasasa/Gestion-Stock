const { Schema, model } = require("mongoose");

const Evento = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        set: value => value.toUpperCase()
    },
    description: {
        type: String,
        trim: true,
        default: '',
        set: value => value.toUpperCase()
    },
    start_date: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    },
    end_date: {
        type: Date,
        default: Date.now + 1,
        required: true,
        validate: {
            validator: function (value) {
                return value >= this.start_date
            },
            message: 'La fecha de finalizacion debe ser posterior a la de inicio'
        }
    },
    all_day: {
        type: Boolean,
        default: false,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'CategoryEvento',
        required: true
    }
});

module.exports = model('Evento', Evento);