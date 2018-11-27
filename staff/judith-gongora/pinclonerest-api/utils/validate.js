const { ValueError } = require('../errors')

function validate(params) {
    params.forEach(({ key, value, type, optional }) => {
        switch (type) {
            case String:
                if (optional && (value === null || value === undefined) ) break  //

                if (typeof value !== 'string') throw TypeError(`${key} is not a string`)

                if (!value.trim().length) throw new ValueError(`${key} is empty or blank`)

                break
            case Boolean:
                if (optional && (value === null || value === undefined)) break

                if (typeof value !== 'boolean') throw TypeError(`${key} is not a boolean`)

                break
            case Number:
                if (optional && (value === null || value === undefined)) break

                if (typeof value !== 'number') throw TypeError(`${key} is not a number`)
        }
    })
}

module.exports = validate