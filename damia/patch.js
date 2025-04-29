
        
                const i32 = (v) => v
                const f32 = i32
                const f64 = i32
                
function toInt(v) {
                    return v
                }
function toFloat(v) {
                    return v
                }
function createFloatArray(length) {
                    return new Float64Array(length)
                }
function setFloatDataView(dataView, position, value) {
                    dataView.setFloat64(position, value)
                }
function getFloatDataView(dataView, position) {
                    return dataView.getFloat64(position)
                }
let IT_FRAME = 0
let FRAME = 0
let BLOCK_SIZE = 0
let SAMPLE_RATE = 0
let NULL_SIGNAL = 0
let INPUT = createFloatArray(0)
let OUTPUT = createFloatArray(0)
const G_sked_ID_NULL = -1
const G_sked__ID_COUNTER_INIT = 1
const G_sked__MODE_WAIT = 0
const G_sked__MODE_SUBSCRIBE = 1


function G_sked_create(isLoggingEvents) {
                return {
                    eventLog: new Set(),
                    events: new Map(),
                    requests: new Map(),
                    idCounter: G_sked__ID_COUNTER_INIT,
                    isLoggingEvents,
                }
            }
function G_sked_wait(skeduler, event, callback) {
                if (skeduler.isLoggingEvents === false) {
                    throw new Error("Please activate skeduler's isLoggingEvents")
                }

                if (skeduler.eventLog.has(event)) {
                    callback(event)
                    return G_sked_ID_NULL
                } else {
                    return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_WAIT)
                }
            }
function G_sked_waitFuture(skeduler, event, callback) {
                return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_WAIT)
            }
function G_sked_subscribe(skeduler, event, callback) {
                return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_SUBSCRIBE)
            }
function G_sked_emit(skeduler, event) {
                if (skeduler.isLoggingEvents === true) {
                    skeduler.eventLog.add(event)
                }
                if (skeduler.events.has(event)) {
                    const skedIds = skeduler.events.get(event)
                    const skedIdsStaying = []
                    for (let i = 0; i < skedIds.length; i++) {
                        if (skeduler.requests.has(skedIds[i])) {
                            const request = skeduler.requests.get(skedIds[i])
                            request.callback(event)
                            if (request.mode === G_sked__MODE_WAIT) {
                                skeduler.requests.delete(request.id)
                            } else {
                                skedIdsStaying.push(request.id)
                            }
                        }
                    }
                    skeduler.events.set(event, skedIdsStaying)
                }
            }
function G_sked_cancel(skeduler, id) {
                skeduler.requests.delete(id)
            }
function G_sked__createRequest(skeduler, event, callback, mode) {
                const id = G_sked__nextId(skeduler)
                const request = {
                    id, 
                    mode, 
                    callback,
                }
                skeduler.requests.set(id, request)
                if (!skeduler.events.has(event)) {
                    skeduler.events.set(event, [id])    
                } else {
                    skeduler.events.get(event).push(id)
                }
                return id
            }
function G_sked__nextId(skeduler) {
                return skeduler.idCounter++
            }
const G_commons__ARRAYS = new Map()
const G_commons__ARRAYS_SKEDULER = G_sked_create(false)
function G_commons_getArray(arrayName) {
            if (!G_commons__ARRAYS.has(arrayName)) {
                throw new Error('Unknown array ' + arrayName)
            }
            return G_commons__ARRAYS.get(arrayName)
        }
function G_commons_hasArray(arrayName) {
            return G_commons__ARRAYS.has(arrayName)
        }
function G_commons_setArray(arrayName, array) {
            G_commons__ARRAYS.set(arrayName, array)
            G_sked_emit(G_commons__ARRAYS_SKEDULER, arrayName)
        }
function G_commons_subscribeArrayChanges(arrayName, callback) {
            const id = G_sked_subscribe(G_commons__ARRAYS_SKEDULER, arrayName, callback)
            if (G_commons__ARRAYS.has(arrayName)) {
                callback(arrayName)
            }
            return id
        }
function G_commons_cancelArrayChangesSubscription(id) {
            G_sked_cancel(G_commons__ARRAYS_SKEDULER, id)
        }

const G_commons__FRAME_SKEDULER = G_sked_create(false)
function G_commons__emitFrame(frame) {
            G_sked_emit(G_commons__FRAME_SKEDULER, frame.toString())
        }
function G_commons_waitFrame(frame, callback) {
            return G_sked_waitFuture(G_commons__FRAME_SKEDULER, frame.toString(), callback)
        }
function G_commons_cancelWaitFrame(id) {
            G_sked_cancel(G_commons__FRAME_SKEDULER, id)
        }
const G_msg_FLOAT_TOKEN = "number"
const G_msg_STRING_TOKEN = "string"
function G_msg_create(template) {
                    const m = []
                    let i = 0
                    while (i < template.length) {
                        if (template[i] === G_msg_STRING_TOKEN) {
                            m.push('')
                            i += 2
                        } else if (template[i] === G_msg_FLOAT_TOKEN) {
                            m.push(0)
                            i += 1
                        }
                    }
                    return m
                }
function G_msg_getLength(message) {
                    return message.length
                }
function G_msg_getTokenType(message, tokenIndex) {
                    return typeof message[tokenIndex]
                }
function G_msg_isStringToken(message, tokenIndex) {
                    return G_msg_getTokenType(message, tokenIndex) === 'string'
                }
function G_msg_isFloatToken(message, tokenIndex) {
                    return G_msg_getTokenType(message, tokenIndex) === 'number'
                }
function G_msg_isMatching(message, tokenTypes) {
                    return (message.length === tokenTypes.length) 
                        && message.every((v, i) => G_msg_getTokenType(message, i) === tokenTypes[i])
                }
function G_msg_writeFloatToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function G_msg_writeStringToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function G_msg_readFloatToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function G_msg_readStringToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function G_msg_floats(values) {
                    return values
                }
function G_msg_strings(values) {
                    return values
                }
function G_msg_display(message) {
                    return '[' + message
                        .map(t => typeof t === 'string' ? '"' + t + '"' : t.toString())
                        .join(', ') + ']'
                }
function G_msg_VOID_MESSAGE_RECEIVER(m) {}
let G_msg_EMPTY_MESSAGE = G_msg_create([])
function G_numbers_roundFloatAsPdInt(value) {
            return value > 0 ? Math.floor(value): Math.ceil(value)
        }
function G_bangUtils_isBang(message) {
            return (
                G_msg_isStringToken(message, 0) 
                && G_msg_readStringToken(message, 0) === 'bang'
            )
        }
function G_bangUtils_bang() {
            const message = G_msg_create([G_msg_STRING_TOKEN, 4])
            G_msg_writeStringToken(message, 0, 'bang')
            return message
        }
function G_bangUtils_emptyToBang(message) {
            if (G_msg_getLength(message) === 0) {
                return G_bangUtils_bang()
            } else {
                return message
            }
        }
function G_msgUtils_slice(message, start, end) {
            if (G_msg_getLength(message) <= start) {
                throw new Error('message empty')
            }
            const template = G_msgUtils__copyTemplate(message, start, end)
            const newMessage = G_msg_create(template)
            G_msgUtils_copy(message, newMessage, start, end, 0)
            return newMessage
        }
function G_msgUtils_concat(message1, message2) {
            const newMessage = G_msg_create(G_msgUtils__copyTemplate(message1, 0, G_msg_getLength(message1)).concat(G_msgUtils__copyTemplate(message2, 0, G_msg_getLength(message2))))
            G_msgUtils_copy(message1, newMessage, 0, G_msg_getLength(message1), 0)
            G_msgUtils_copy(message2, newMessage, 0, G_msg_getLength(message2), G_msg_getLength(message1))
            return newMessage
        }
function G_msgUtils_shift(message) {
            switch (G_msg_getLength(message)) {
                case 0:
                    throw new Error('message empty')
                case 1:
                    return G_msg_create([])
                default:
                    return G_msgUtils_slice(message, 1, G_msg_getLength(message))
            }
        }
function G_msgUtils_copy(src, dest, srcStart, srcEnd, destStart) {
            let i = srcStart
            let j = destStart
            for (i, j; i < srcEnd; i++, j++) {
                if (G_msg_getTokenType(src, i) === G_msg_STRING_TOKEN) {
                    G_msg_writeStringToken(dest, j, G_msg_readStringToken(src, i))
                } else {
                    G_msg_writeFloatToken(dest, j, G_msg_readFloatToken(src, i))
                }
            }
        }
function G_msgUtils__copyTemplate(src, start, end) {
            const template = []
            for (let i = start; i < end; i++) {
                const tokenType = G_msg_getTokenType(src, i)
                template.push(tokenType)
                if (tokenType === G_msg_STRING_TOKEN) {
                    template.push(G_msg_readStringToken(src, i).length)
                }
            }
            return template
        }
const G_msgBuses__BUSES = new Map()
function G_msgBuses_publish(busName, message) {
            let i = 0
            const callbacks = G_msgBuses__BUSES.has(busName) ? G_msgBuses__BUSES.get(busName): []
            for (i = 0; i < callbacks.length; i++) {
                callbacks[i](message)
            }
        }
function G_msgBuses_subscribe(busName, callback) {
            if (!G_msgBuses__BUSES.has(busName)) {
                G_msgBuses__BUSES.set(busName, [])
            }
            G_msgBuses__BUSES.get(busName).push(callback)
        }
function G_msgBuses_unsubscribe(busName, callback) {
            if (!G_msgBuses__BUSES.has(busName)) {
                return
            }
            const callbacks = G_msgBuses__BUSES.get(busName)
            const found = callbacks.indexOf(callback)
            if (found !== -1) {
                callbacks.splice(found, 1)
            }
        }
function G_tokenConversion_toFloat(m, i) {
        if (G_msg_isFloatToken(m, i)) {
            return G_msg_readFloatToken(m, i)
        } else {
            return 0
        }
    }
function G_tokenConversion_toString_(m, i) {
        if (G_msg_isStringToken(m, i)) {
            const str = G_msg_readStringToken(m, i)
            if (str === 'bang') {
                return 'symbol'
            } else {
                return str
            }
        } else {
            return 'float'
        }
    }
function G_funcs_mtof(value) {
        return value <= -1500 ? 0: (value > 1499 ? 3.282417553401589e+38 : Math.pow(2, (value - 69) / 12) * 440)
    }
function G_actionUtils_isAction(message, action) {
            return G_msg_isMatching(message, [G_msg_STRING_TOKEN])
                && G_msg_readStringToken(message, 0) === action
        }
function computeUnitInSamples(sampleRate, amount, unit) {
        if (unit.slice(0, 3) === 'per') {
            if (amount !== 0) {
                amount = 1 / amount
            }
            unit = unit.slice(3)
        }

        if (unit === 'msec' || unit === 'milliseconds' || unit === 'millisecond') {
            return amount / 1000 * sampleRate
        } else if (unit === 'sec' || unit === 'seconds' || unit === 'second') {
            return amount * sampleRate
        } else if (unit === 'min' || unit === 'minutes' || unit === 'minute') {
            return amount * 60 * sampleRate
        } else if (unit === 'samp' || unit === 'samples' || unit === 'sample') {
            return amount
        } else {
            throw new Error("invalid time unit : " + unit)
        }
    }

function G_points_interpolateLin(x, p0, p1) {
        return p0.y + (x - p0.x) * (p1.y - p0.y) / (p1.x - p0.x)
    }

function G_linesUtils_computeSlope(p0, p1) {
            return p1.x !== p0.x ? (p1.y - p0.y) / (p1.x - p0.x) : 0
        }
function G_linesUtils_removePointsBeforeFrame(points, frame) {
            const newPoints = []
            let i = 0
            while (i < points.length) {
                if (frame <= points[i].x) {
                    newPoints.push(points[i])
                }
                i++
            }
            return newPoints
        }
function G_linesUtils_insertNewLinePoints(points, p0, p1) {
            const newPoints = []
            let i = 0
            
            // Keep the points that are before the new points added
            while (i < points.length && points[i].x <= p0.x) {
                newPoints.push(points[i])
                i++
            }
            
            // Find the start value of the start point :
            
            // 1. If there is a previous point and that previous point
            // is on the same frame, we don't modify the start point value.
            // (represents a vertical line).
            if (0 < i - 1 && points[i - 1].x === p0.x) {

            // 2. If new points are inserted in between already existing points 
            // we need to interpolate the existing line to find the startValue.
            } else if (0 < i && i < points.length) {
                newPoints.push({
                    x: p0.x,
                    y: G_points_interpolateLin(p0.x, points[i - 1], points[i])
                })

            // 3. If new line is inserted after all existing points, 
            // we just take the value of the last point
            } else if (i >= points.length && points.length) {
                newPoints.push({
                    x: p0.x,
                    y: points[points.length - 1].y,
                })

            // 4. If new line placed in first position, we take the defaultStartValue.
            } else if (i === 0) {
                newPoints.push({
                    x: p0.x,
                    y: p0.y,
                })
            }
            
            newPoints.push({
                x: p1.x,
                y: p1.y,
            })
            return newPoints
        }
function G_linesUtils_computeFrameAjustedPoints(points) {
            if (points.length < 2) {
                throw new Error('invalid length for points')
            }

            const newPoints = []
            let i = 0
            let p = points[0]
            let frameLower = 0
            let frameUpper = 0
            
            while(i < points.length) {
                p = points[i]
                frameLower = Math.floor(p.x)
                frameUpper = frameLower + 1

                // I. Placing interpolated point at the lower bound of the current frame
                // ------------------------------------------------------------------------
                // 1. Point is already on an exact frame,
                if (p.x === frameLower) {
                    newPoints.push({ x: p.x, y: p.y })

                    // 1.a. if several of the next points are also on the same X,
                    // we find the last one to draw a vertical line.
                    while (
                        (i + 1) < points.length
                        && points[i + 1].x === frameLower
                    ) {
                        i++
                    }
                    if (points[i].y !== newPoints[newPoints.length - 1].y) {
                        newPoints.push({ x: points[i].x, y: points[i].y })
                    }

                    // 1.b. if last point, we quit
                    if (i + 1 >= points.length) {
                        break
                    }

                    // 1.c. if next point is in a different frame we can move on to next iteration
                    if (frameUpper <= points[i + 1].x) {
                        i++
                        continue
                    }
                
                // 2. Point isn't on an exact frame
                // 2.a. There's a previous point, the we use it to interpolate the value.
                } else if (newPoints.length) {
                    newPoints.push({
                        x: frameLower,
                        y: G_points_interpolateLin(frameLower, points[i - 1], p),
                    })
                
                // 2.b. It's the very first point, then we don't change its value.
                } else {
                    newPoints.push({ x: frameLower, y: p.y })
                }

                // II. Placing interpolated point at the upper bound of the current frame
                // ---------------------------------------------------------------------------
                // First, we find the closest point from the frame upper bound (could be the same p).
                // Or could be a point that is exactly placed on frameUpper.
                while (
                    (i + 1) < points.length 
                    && (
                        Math.ceil(points[i + 1].x) === frameUpper
                        || Math.floor(points[i + 1].x) === frameUpper
                    )
                ) {
                    i++
                }
                p = points[i]

                // 1. If the next point is directly in the next frame, 
                // we do nothing, as this corresponds with next iteration frameLower.
                if (Math.floor(p.x) === frameUpper) {
                    continue
                
                // 2. If there's still a point after p, we use it to interpolate the value
                } else if (i < points.length - 1) {
                    newPoints.push({
                        x: frameUpper,
                        y: G_points_interpolateLin(frameUpper, p, points[i + 1]),
                    })

                // 3. If it's the last point, we dont change the value
                } else {
                    newPoints.push({ x: frameUpper, y: p.y })
                }

                i++
            }

            return newPoints
        }
function G_linesUtils_computeLineSegments(points) {
            const lineSegments = []
            let i = 0
            let p0
            let p1

            while(i < points.length - 1) {
                p0 = points[i]
                p1 = points[i + 1]
                lineSegments.push({
                    p0, p1, 
                    dy: G_linesUtils_computeSlope(p0, p1),
                    dx: 1,
                })
                i++
            }
            return lineSegments
        }
const G_sigBuses__BUSES = new Map()
G_sigBuses__BUSES.set('', 0)
function G_sigBuses_addAssign(busName, value) {
            const newValue = G_sigBuses__BUSES.get(busName) + value
            G_sigBuses__BUSES.set(
                busName,
                newValue,
            )
            return newValue
        }
function G_sigBuses_set(busName, value) {
            G_sigBuses__BUSES.set(
                busName,
                value,
            )
        }
function G_sigBuses_reset(busName) {
            G_sigBuses__BUSES.set(busName, 0)
        }
function G_sigBuses_read(busName) {
            return G_sigBuses__BUSES.get(busName)
        }

function G_buf_clear(buffer) {
            buffer.data.fill(0)
        }
function G_buf_create(length) {
            return {
                data: createFloatArray(length),
                length: length,
                writeCursor: 0,
                pullAvailableLength: 0,
            }
        }
const G_delayBuffers__BUFFERS = new Map()
const G_delayBuffers__SKEDULER = G_sked_create(true)
const G_delayBuffers_NULL_BUFFER = G_buf_create(1)
function G_delayBuffers_get(delayName) {
            G_delayBuffers__BUFFERS.get(delayName, buffer)
        }
function G_delayBuffers_set(delayName, buffer) {
            G_delayBuffers__BUFFERS.set(delayName, buffer)
            G_sked_emit(G_delayBuffers__SKEDULER, delayName)
        }
function G_delayBuffers_wait(delayName, callback) {
            G_sked_wait(G_delayBuffers__SKEDULER, delayName, callback)
        }
function G_delayBuffers_delete(delayName) {
            G_delayBuffers__BUFFERS.delete(delayName)
        }
function G_buf_writeSample(buffer, value) {
            buffer.data[buffer.writeCursor] = value
            buffer.writeCursor = (buffer.writeCursor + 1) % buffer.length
        }
function G_buf_readSample(buffer, offset) {
            // R = (buffer.writeCursor - 1 - offset) -> ideal read position
            // W = R % buffer.length -> wrap it so that its within buffer length bounds (but could be negative)
            // (W + buffer.length) % buffer.length -> if W negative, (W + buffer.length) shifts it back to positive.
            return buffer.data[(buffer.length + ((buffer.writeCursor - 1 - offset) % buffer.length)) % buffer.length]
        }
        
function NT_int_setValue(state, value) {
                state.value = G_numbers_roundFloatAsPdInt(value)
            }





function NT_random_setMaxValue(state, maxValue) {
                state.maxValue = Math.max(maxValue, 0)
            }



function NT_add_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_add_setRight(state, value) {
                    state.rightOp = value
                }

function NT_tgl_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_tgl_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_tgl_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_tgl_defaultMessageHandler(m) {}
function NT_tgl_receiveMessage(state, m) {
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        state.valueFloat = G_msg_readFloatToken(m, 0)
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (G_bangUtils_isBang(m)) {
                        state.valueFloat = state.valueFloat === 0 ? state.maxValue: 0
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (
                        G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN]) 
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        state.valueFloat = G_msg_readFloatToken(m, 1)
                        return
                    
                    } else if (NT_tgl_setSendReceiveFromMessage(state, m) === true) {
                        return
                    }
                }





function NT_modlegacy_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_modlegacy_setRight(state, value) {
                    state.rightOp = value
                }











function NT_div_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_div_setRight(state, value) {
                    state.rightOp = value
                }

const NT_line_t_defaultLine = {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            }
function NT_line_t_setNewLine(state, targetValue) {
                const startFrame = toFloat(FRAME)
                const endFrame = toFloat(FRAME) + state.nextDurationSamp
                if (endFrame === toFloat(FRAME)) {
                    state.currentLine = NT_line_t_defaultLine
                    state.currentValue = targetValue
                    state.nextDurationSamp = 0
                } else {
                    state.currentLine = {
                        p0: {
                            x: startFrame, 
                            y: state.currentValue,
                        }, 
                        p1: {
                            x: endFrame, 
                            y: targetValue,
                        }, 
                        dx: 1,
                        dy: 0,
                    }
                    state.currentLine.dy = G_linesUtils_computeSlope(state.currentLine.p0, state.currentLine.p1)
                    state.nextDurationSamp = 0
                }
            }
function NT_line_t_setNextDuration(state, durationMsec) {
                state.nextDurationSamp = computeUnitInSamples(SAMPLE_RATE, durationMsec, 'msec')
            }
function NT_line_t_stop(state) {
                state.currentLine.p1.x = -1
                state.currentLine.p1.y = state.currentValue
            }

function NT_delay_setDelay(state, delay) {
                state.delay = Math.max(0, delay)
            }
function NT_delay_scheduleDelay(state, callback, currentFrame) {
                if (state.scheduledBang !== G_sked_ID_NULL) {
                    NT_delay_stop(state)
                }
                state.scheduledBang = G_commons_waitFrame(toInt(
                    Math.round(
                        toFloat(currentFrame) + state.delay * state.sampleRatio)),
                    callback
                )
            }
function NT_delay_stop(state) {
                G_commons_cancelWaitFrame(state.scheduledBang)
                state.scheduledBang = G_sked_ID_NULL
            }

function NT_line_setNewLine(state, targetValue) {
                state.currentLine = {
                    p0: {
                        x: toFloat(FRAME), 
                        y: state.currentValue,
                    }, 
                    p1: {
                        x: toFloat(FRAME) + state.nextDurationSamp, 
                        y: targetValue,
                    }, 
                    dx: state.grainSamp
                }
                state.nextDurationSamp = 0
                state.currentLine.dy = G_linesUtils_computeSlope(state.currentLine.p0, state.currentLine.p1) * state.grainSamp
            }
function NT_line_setNextDuration(state, durationMsec) {
                state.nextDurationSamp = computeUnitInSamples(SAMPLE_RATE, durationMsec, 'msec')
            }
function NT_line_setGrain(state, grainMsec) {
                state.grainSamp = computeUnitInSamples(SAMPLE_RATE, Math.max(grainMsec, 20), 'msec')
            }
function NT_line_stopCurrentLine(state) {
                if (state.skedId !== G_sked_ID_NULL) {
                    G_commons_cancelWaitFrame(state.skedId)
                    state.skedId = G_sked_ID_NULL
                }
                if (FRAME < state.nextSampInt) {
                    NT_line_incrementTime(state, -1 * (state.nextSamp - toFloat(FRAME)))
                }
                NT_line_setNextSamp(state, -1)
            }
function NT_line_setNextSamp(state, currentSamp) {
                state.nextSamp = currentSamp
                state.nextSampInt = toInt(Math.round(currentSamp))
            }
function NT_line_incrementTime(state, incrementSamp) {
                if (incrementSamp === state.currentLine.dx) {
                    state.currentValue += state.currentLine.dy
                } else {
                    state.currentValue += G_points_interpolateLin(
                        incrementSamp,
                        {x: 0, y: 0},
                        {x: state.currentLine.dx, y: state.currentLine.dy},
                    )
                }
                NT_line_setNextSamp(
                    state, 
                    (state.nextSamp !== -1 ? state.nextSamp: toFloat(FRAME)) + incrementSamp
                )
            }
function NT_line_tick(state) {
                state.snd0(G_msg_floats([state.currentValue]))
                if (toFloat(FRAME) >= state.currentLine.p1.x) {
                    state.currentValue = state.currentLine.p1.y
                    NT_line_stopCurrentLine(state)
                } else {
                    NT_line_incrementTime(state, state.currentLine.dx)
                    NT_line_scheduleNextTick(state)
                }
            }
function NT_line_scheduleNextTick(state) {
                state.skedId = G_commons_waitFrame(state.nextSampInt, state.tickCallback)
            }

function NT_sub_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_sub_setRight(state, value) {
                    state.rightOp = value
                }

function NT_osc_t_setStep(state, freq) {
                    state.step = (2 * Math.PI / SAMPLE_RATE) * freq
                }
function NT_osc_t_setPhase(state, phase) {
                    state.phase = phase % 1.0 * 2 * Math.PI
                }



function NT_bang_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_bang_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_bang_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_bang_defaultMessageHandler(m) {}
function NT_bang_receiveMessage(state, m) {
                if (NT_bang_setSendReceiveFromMessage(state, m) === true) {
                    return
                }
                
                const outMessage = G_bangUtils_bang()
                state.messageSender(outMessage)
                if (state.sendBusName !== "empty") {
                    G_msgBuses_publish(state.sendBusName, outMessage)
                }
                return
            }

function NT_metro_setRate(state, rate) {
                state.rate = Math.max(rate, 0)
            }
function NT_metro_scheduleNextTick(state) {
                state.snd0(G_bangUtils_bang())
                state.realNextTick = state.realNextTick + state.rate * state.sampleRatio
                state.skedId = G_commons_waitFrame(
                    toInt(Math.round(state.realNextTick)), 
                    state.tickCallback,
                )
            }
function NT_metro_stop(state) {
                if (state.skedId !== G_sked_ID_NULL) {
                    G_commons_cancelWaitFrame(state.skedId)
                    state.skedId = G_sked_ID_NULL
                }
                state.realNextTick = 0
            }



function NT_float_setValue(state, value) {
                state.value = value
            }



function NT_mul_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_mul_setRight(state, value) {
                    state.rightOp = value
                }







function NT_list_setSplitPoint(state, value) {
                state.splitPoint = toInt(value)
            }







function NT_receive_t_setBusName(state, busName) {
            if (busName.length) {
                state.busName = busName
                G_sigBuses_reset(state.busName)
            }
        }

function NT_delread_t_setDelayName(state, delayName, callback) {
                if (state.delayName.length) {
                    state.buffer = G_delayBuffers_NULL_BUFFER
                }
                state.delayName = delayName
                if (state.delayName.length) {
                    G_delayBuffers_wait(state.delayName, callback)
                }
            }
function NT_delread_t_setRawOffset(state, rawOffset) {
                state.rawOffset = rawOffset
                NT_delread_t_updateOffset(state)
            }
function NT_delread_t_updateOffset(state) {
                state.offset = toInt(Math.round(
                    Math.min(
                        Math.max(computeUnitInSamples(SAMPLE_RATE, state.rawOffset, "msec"), 0), 
                        toFloat(state.buffer.length - 1)
                    )
                ))
            }
function NT_delread_t_NOOP(_) {}

function NT_lop_t_setFreq(state, freq) {
                state.coeff = Math.max(Math.min(freq * 2 * Math.PI / SAMPLE_RATE, 1), 0)
            }







function NT_send_t_setBusName(state, busName) {
            if (busName.length) {
                state.busName = busName
                G_sigBuses_reset(state.busName)
            }
        }

function NT_delwrite_t_setDelayName(state, delayName) {
                if (state.delayName.length) {
                    G_delayBuffers_delete(state.delayName)
                }
                state.delayName = delayName
                if (state.delayName.length) {
                    G_delayBuffers_set(state.delayName, state.buffer)
                }
            }

        const N_n_0_0_state = {
                                value: 0,
                            }
const N_n_0_34_state = {
                                value: 0,
                            }
const N_n_0_21_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_22_state = {
                                value: 0,
                            }
const N_n_0_68_state = {
                                busName: "note1",
                            }
const N_n_0_23_state = {
                                value: 0,
                            }
const N_n_0_24_state = {
                                value: 0,
                            }
const N_n_0_25_state = {
                                value: 0,
                            }
const N_n_0_26_state = {
                                value: 0,
                            }
const N_n_0_32_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_33_state = {
                                value: 0,
                            }
const N_n_0_35_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_13_7_state = {
                                maxValue: 5,
                            }
const N_n_0_31_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_1_state = {
                                value: 0,
                            }
const N_n_0_2_state = {
                                value: 0,
                            }
const N_n_0_3_state = {
                                value: 0,
                            }
const N_n_12_7_state = {
                                maxValue: 5,
                            }
const N_n_0_30_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_4_state = {
                                value: 0,
                            }
const N_n_0_5_state = {
                                value: 0,
                            }
const N_n_0_6_state = {
                                value: 0,
                            }
const N_n_0_20_state = {
                                value: 0,
                            }
const N_n_9_7_state = {
                                maxValue: 6,
                            }
const N_n_0_29_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_7_state = {
                                value: 0,
                            }
const N_n_0_8_state = {
                                value: 0,
                            }
const N_n_0_9_state = {
                                value: 0,
                            }
const N_n_0_11_state = {
                                value: 0,
                            }
const N_n_0_10_state = {
                                value: 0,
                            }
const N_n_11_7_state = {
                                maxValue: 5,
                            }
const N_n_0_28_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_19_state = {
                                value: 0,
                            }
const N_n_0_13_state = {
                                value: 0,
                            }
const N_n_0_14_state = {
                                value: 0,
                            }
const N_n_0_12_state = {
                                value: 0,
                            }
const N_n_8_7_state = {
                                maxValue: 5,
                            }
const N_n_0_27_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_15_state = {
                                value: 0,
                            }
const N_n_0_17_state = {
                                value: 0,
                            }
const N_n_0_18_state = {
                                value: 0,
                            }
const N_n_0_16_state = {
                                value: 0,
                            }
const N_n_0_38_state = {
                                maxValue: 2,
                            }
const N_n_0_39_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_40_state = {
                                value: 0,
                            }
const N_n_0_42_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_44_state = {
                                value: 0,
                            }
const N_n_0_54_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_55_state = {
                                value: 0,
                            }
const N_n_0_60_state = {
                                busName: "note2",
                            }
const N_n_0_56_state = {
                                value: 0,
                            }
const N_n_0_57_state = {
                                value: 0,
                            }
const N_n_0_58_state = {
                                value: 0,
                            }
const N_n_0_59_state = {
                                value: 0,
                            }
const N_n_10_7_state = {
                                maxValue: 2,
                            }
const N_n_0_45_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_46_state = {
                                value: 0,
                            }
const N_n_0_48_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_14_7_state = {
                                maxValue: 2,
                            }
const N_n_0_53_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_51_state = {
                                value: 0,
                            }
const N_n_0_61_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_62_state = {
                                value: 0,
                            }
const N_n_0_67_state = {
                                busName: "note3",
                            }
const N_n_0_63_state = {
                                value: 0,
                            }
const N_n_0_64_state = {
                                value: 0,
                            }
const N_n_0_65_state = {
                                value: 0,
                            }
const N_n_0_66_state = {
                                value: 0,
                            }
const N_n_0_47_state = {
                                value: 0,
                            }
const N_n_0_49_state = {
                                value: 0,
                            }
const N_n_0_50_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_52_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_70_state = {
                                minValue: 0,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "start",
messageReceiver: NT_tgl_defaultMessageHandler,
messageSender: NT_tgl_defaultMessageHandler,
                            }
const N_n_1_16_state = {
                                value: 0,
                            }
const N_n_1_19_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_1_20_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_1_17_state = {
                                floatValues: [0,0,0],
stringValues: ["","",""],
                            }
const N_n_1_23_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_m_n_1_1_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_1_13_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_1_2_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_1_11_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_1_63_state = {
                                floatValues: [0,10],
stringValues: ["",""],
                            }
const N_n_1_5_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_1_8_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_1_12_state = {
                                floatValues: [0,8000],
stringValues: ["",""],
                            }
const N_m_n_1_25_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_1_37_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_1_26_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_1_35_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_1_64_state = {
                                floatValues: [0,10],
stringValues: ["",""],
                            }
const N_n_1_29_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_1_32_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_1_36_state = {
                                floatValues: [0,8000],
stringValues: ["",""],
                            }
const N_m_n_1_41_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_1_53_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_1_42_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_1_51_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_1_65_state = {
                                floatValues: [0,10],
stringValues: ["",""],
                            }
const N_n_1_45_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_1_48_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_1_52_state = {
                                floatValues: [0,8000],
stringValues: ["",""],
                            }
const N_n_1_21_state = {
                                maxValue: 17,
                            }
const N_n_1_22_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_16_state = {
                                value: 0,
                            }
const N_n_2_19_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_20_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_17_state = {
                                floatValues: [0,0,0],
stringValues: ["","",""],
                            }
const N_n_2_23_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_m_n_2_1_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_2_13_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_2_2_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_2_11_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_63_state = {
                                floatValues: [0,10],
stringValues: ["",""],
                            }
const N_n_2_5_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_2_8_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_2_12_state = {
                                floatValues: [0,8000],
stringValues: ["",""],
                            }
const N_m_n_2_25_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_2_37_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_2_26_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_2_35_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_64_state = {
                                floatValues: [0,10],
stringValues: ["",""],
                            }
const N_n_2_29_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_2_32_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_2_36_state = {
                                floatValues: [0,8000],
stringValues: ["",""],
                            }
const N_m_n_2_41_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_2_53_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_2_42_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_2_51_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_65_state = {
                                floatValues: [0,10],
stringValues: ["",""],
                            }
const N_n_2_45_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_2_48_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_2_52_state = {
                                floatValues: [0,8000],
stringValues: ["",""],
                            }
const N_n_2_21_state = {
                                maxValue: 17,
                            }
const N_n_2_22_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_3_16_state = {
                                value: 0,
                            }
const N_n_3_19_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_3_20_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_3_17_state = {
                                floatValues: [0,0,0],
stringValues: ["","",""],
                            }
const N_n_3_23_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_m_n_3_1_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_3_13_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_3_2_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_3_11_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_3_63_state = {
                                floatValues: [0,10],
stringValues: ["",""],
                            }
const N_n_3_5_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_3_8_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_3_12_state = {
                                floatValues: [0,8000],
stringValues: ["",""],
                            }
const N_m_n_3_25_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_3_37_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_3_26_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_3_35_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_3_64_state = {
                                floatValues: [0,10],
stringValues: ["",""],
                            }
const N_n_3_29_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_3_32_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_3_36_state = {
                                floatValues: [0,8000],
stringValues: ["",""],
                            }
const N_m_n_3_41_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_3_53_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_3_42_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_3_51_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_3_65_state = {
                                floatValues: [0,10],
stringValues: ["",""],
                            }
const N_n_3_45_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_3_48_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_3_52_state = {
                                floatValues: [0,8000],
stringValues: ["",""],
                            }
const N_n_3_21_state = {
                                maxValue: 17,
                            }
const N_n_3_22_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_91_state = {
                                value: 0,
                            }
const N_n_0_112_state = {
                                floatValues: [0,500],
stringValues: ["",""],
                            }
const N_n_0_111_state = {
                                currentLine: {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            },
currentValue: 0,
nextSamp: -1,
nextSampInt: -1,
grainSamp: 0,
nextDurationSamp: 0,
skedId: G_sked_ID_NULL,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_n_0_85_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_0_84_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_m_n_0_89_0_sig_state = {
                                currentValue: 0,
                            }
const N_m_n_0_88_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_93_state = {
                                value: 0,
                            }
const N_n_0_88_state = {
                                phase: 0,
step: 0,
                            }
const N_n_0_89_state = {
                                phase: 0,
step: 0,
                            }
const N_n_0_94_state = {
                                floatValues: [0,8000],
stringValues: ["",""],
                            }
const N_n_0_87_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_0_90_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_114_state = {
                                sampleRatio: 0,
resetTime: 0,
                            }
const N_n_0_116_state = {
                                value: 0,
                            }
const N_n_0_117_state = {
                                busName: "SEED",
                            }
const N_n_0_100_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "giaale",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_101_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "mera",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_102_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "poan",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_103_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "maisia",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_104_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "bagat",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_105_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "mazand",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_106_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "rastad",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_0_69_state = {
                                rate: 0,
sampleRatio: 1,
skedId: G_sked_ID_NULL,
realNextTick: -1,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_n_4_65_state = {
                                value: 0,
                            }
const N_n_4_64_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_4_27_state = {
                                floatValues: [0,30],
stringValues: ["",""],
                            }
const N_n_4_14_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_4_66_state = {
                                value: 0,
                            }
const N_n_4_33_state = {
                                minValue: 0,
maxValue: 100,
                            }
const N_n_4_32_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_4_28_state = {
                                floatValues: [0,50],
stringValues: ["",""],
                            }
const N_n_4_15_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_4_67_state = {
                                value: 0,
                            }
const N_n_4_40_state = {
                                threshold: 1,
                            }
const N_n_4_41_state = {
                                msgSpecs: [],
                            }
const N_n_4_44_state = {
                                value: 0,
                            }
const N_m_n_4_34_1_sig_state = {
                                currentValue: 0,
                            }
const N_m_n_4_52_1_sig_state = {
                                currentValue: 0,
                            }
const N_m_n_4_56_1_sig_state = {
                                currentValue: 0,
                            }
const N_m_n_4_60_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_4_68_state = {
                                value: 0,
                            }
const N_n_4_42_state = {
                                minValue: 0,
maxValue: 100,
                            }
const N_n_4_45_state = {
                                value: 0,
                            }
const N_n_4_46_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_4_47_state = {
                                floatValues: [0,50],
stringValues: ["",""],
                            }
const N_n_4_48_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_6_1_state = {
                                msgSpecs: [],
                            }
const N_n_6_0_state = {
                                splitPoint: 0,
currentList: G_msg_create([]),
                            }
const N_n_0_36_state = {
                                floatFilter: 1,
stringFilter: "1",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_0_95_state = {
                                busName: "note4",
                            }
const N_n_6_2_state = {
                                msgSpecs: [],
                            }
const N_n_6_3_state = {
                                msgSpecs: [],
                            }
const N_n_6_4_state = {
                                msgSpecs: [],
                            }
const N_n_6_5_state = {
                                msgSpecs: [],
                            }
const N_n_6_6_state = {
                                msgSpecs: [],
                            }
const N_n_6_7_state = {
                                msgSpecs: [],
                            }
const N_n_6_19_state = {
                                delay: 0,
sampleRatio: 1,
scheduledBang: G_sked_ID_NULL,
                            }
const N_n_7_7_state = {
                                maxValue: 7,
                            }
const N_n_6_18_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_7_4_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_7_1_state = {
                                msgSpecs: [],
                            }
const N_n_7_5_state = {
                                maxValue: 2e+32,
                            }
const N_n_8_4_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_8_1_state = {
                                msgSpecs: [],
                            }
const N_n_8_5_state = {
                                maxValue: 2e+32,
                            }
const N_n_9_4_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_9_1_state = {
                                msgSpecs: [],
                            }
const N_n_9_5_state = {
                                maxValue: 2e+32,
                            }
const N_n_10_4_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_10_1_state = {
                                msgSpecs: [],
                            }
const N_n_10_5_state = {
                                maxValue: 2e+32,
                            }
const N_n_11_4_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_11_1_state = {
                                msgSpecs: [],
                            }
const N_n_11_5_state = {
                                maxValue: 2e+32,
                            }
const N_n_12_4_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_12_1_state = {
                                msgSpecs: [],
                            }
const N_n_12_5_state = {
                                maxValue: 2e+32,
                            }
const N_n_13_4_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_13_1_state = {
                                msgSpecs: [],
                            }
const N_n_13_5_state = {
                                maxValue: 2e+32,
                            }
const N_n_14_4_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_14_1_state = {
                                msgSpecs: [],
                            }
const N_n_14_5_state = {
                                maxValue: 2e+32,
                            }
const N_n_1_2_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_1_14_1_sig_state = {
                                currentValue: 650,
                            }
const N_n_1_4_state = {
                                phase: 0,
step: 0,
                            }
const N_n_1_26_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_1_38_1_sig_state = {
                                currentValue: 650,
                            }
const N_n_1_28_state = {
                                phase: 0,
step: 0,
                            }
const N_n_1_42_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_1_54_1_sig_state = {
                                currentValue: 650,
                            }
const N_n_1_44_state = {
                                phase: 0,
step: 0,
                            }
const N_n_2_2_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_2_14_1_sig_state = {
                                currentValue: 650,
                            }
const N_n_2_4_state = {
                                phase: 0,
step: 0,
                            }
const N_n_2_26_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_2_38_1_sig_state = {
                                currentValue: 650,
                            }
const N_n_2_28_state = {
                                phase: 0,
step: 0,
                            }
const N_n_2_42_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_2_54_1_sig_state = {
                                currentValue: 650,
                            }
const N_n_2_44_state = {
                                phase: 0,
step: 0,
                            }
const N_n_3_2_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_3_14_1_sig_state = {
                                currentValue: 650,
                            }
const N_n_3_4_state = {
                                phase: 0,
step: 0,
                            }
const N_n_3_26_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_3_38_1_sig_state = {
                                currentValue: 650,
                            }
const N_n_3_28_state = {
                                phase: 0,
step: 0,
                            }
const N_n_3_42_state = {
                                phase: 0,
step: 0,
                            }
const N_m_n_3_54_1_sig_state = {
                                currentValue: 650,
                            }
const N_n_3_44_state = {
                                phase: 0,
step: 0,
                            }
const N_n_0_98_state = {
                                busName: "",
                            }
const N_m_n_0_110_1_sig_state = {
                                currentValue: 0.5,
                            }
const N_m_n_0_81_1_sig_state = {
                                currentValue: 0.0625,
                            }
const N_m_n_5_14_0_sig_state = {
                                currentValue: 43.5337,
                            }
const N_n_5_14_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_m_n_5_16_0_sig_state = {
                                currentValue: 25.796,
                            }
const N_n_5_16_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_m_n_5_18_0_sig_state = {
                                currentValue: 19.392,
                            }
const N_n_5_18_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_m_n_5_20_0_sig_state = {
                                currentValue: 16.364,
                            }
const N_n_5_20_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_m_n_5_24_0_sig_state = {
                                currentValue: 7.645,
                            }
const N_n_5_24_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_m_n_4_16_0_sig_state = {
                                currentValue: 58.6435,
                            }
const N_n_4_16_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_n_4_34_state = {
                                previous: 0,
coeff: 0,
                            }
const N_m_n_5_22_0_sig_state = {
                                currentValue: 4.2546,
                            }
const N_n_5_22_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_m_n_4_17_0_sig_state = {
                                currentValue: 69.4325,
                            }
const N_n_4_17_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_n_4_52_state = {
                                previous: 0,
coeff: 0,
                            }
const N_n_0_97_state = {
                                busName: "",
                            }
const N_m_n_4_18_0_sig_state = {
                                currentValue: 74.5234,
                            }
const N_n_4_18_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_n_4_56_state = {
                                previous: 0,
coeff: 0,
                            }
const N_m_n_4_19_0_sig_state = {
                                currentValue: 86.1244,
                            }
const N_n_4_19_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
rawOffset: 0,
offset: 0,
setDelayNameCallback: NT_delread_t_NOOP,
                            }
const N_n_4_60_state = {
                                previous: 0,
coeff: 0,
                            }
const N_n_4_22_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_n_4_23_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_n_4_24_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_n_4_25_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_n_5_13_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_n_5_15_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_n_5_17_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_n_5_19_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_n_5_21_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
const N_n_5_23_state = {
                                delayName: "",
buffer: G_delayBuffers_NULL_BUFFER,
                            }
        
function N_n_0_0_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_0_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_0_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_0_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_34_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_34_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_snds_0(G_msg_floats([N_n_0_34_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_snds_0(G_msg_floats([N_n_0_34_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_34", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_34_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_34_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_34", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_21_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_22_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_23_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_24_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_25_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 5
                            ) {
                                N_n_0_26_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_21", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_22_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_22_state, G_msg_readFloatToken(m, 0))
                N_n_0_68_rcvs_0(G_msg_floats([N_n_0_22_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_68_rcvs_0(G_msg_floats([N_n_0_22_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_22", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_22_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_22_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_22", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_68_rcvs_0(m) {
                            
            G_msgBuses_publish(N_n_0_68_state.busName, m)
            return
        
                            throw new Error('Node "n_0_68", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_23_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_23_state, G_msg_readFloatToken(m, 0))
                N_n_0_68_rcvs_0(G_msg_floats([N_n_0_23_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_68_rcvs_0(G_msg_floats([N_n_0_23_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_23", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_23_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_23_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_23", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_24_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_24_state, G_msg_readFloatToken(m, 0))
                N_n_0_68_rcvs_0(G_msg_floats([N_n_0_24_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_68_rcvs_0(G_msg_floats([N_n_0_24_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_24", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_24_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_24_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_24", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_25_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_25_state, G_msg_readFloatToken(m, 0))
                N_n_0_68_rcvs_0(G_msg_floats([N_n_0_25_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_68_rcvs_0(G_msg_floats([N_n_0_25_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_25", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_25_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_25_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_25", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_26_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_26_state, G_msg_readFloatToken(m, 0))
                N_n_0_68_rcvs_0(G_msg_floats([N_n_0_26_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_68_rcvs_0(G_msg_floats([N_n_0_26_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_26", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_26_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_26_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_26", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_32_rcvs_0(m) {
                            
                    if (N_n_0_32_state.filterType === G_msg_STRING_TOKEN) {
                        if (
                            (N_n_0_32_state.stringFilter === 'float'
                                && G_msg_isFloatToken(m, 0))
                            || (N_n_0_32_state.stringFilter === 'symbol'
                                && G_msg_isStringToken(m, 0))
                            || (N_n_0_32_state.stringFilter === 'list'
                                && G_msg_getLength(m) > 1)
                            || (N_n_0_32_state.stringFilter === 'bang' 
                                && G_bangUtils_isBang(m))
                        ) {
                            N_n_0_33_rcvs_0(m)
                            return
                        
                        } else if (
                            G_msg_isStringToken(m, 0)
                            && G_msg_readStringToken(m, 0) === N_n_0_32_state.stringFilter
                        ) {
                            N_n_0_33_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                            return
                        }
    
                    } else if (
                        G_msg_isFloatToken(m, 0)
                        && G_msg_readFloatToken(m, 0) === N_n_0_32_state.floatFilter
                    ) {
                        N_n_0_33_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                        return
                    }
                
                    N_n_0_32_snds_1(m)
                return
                
                            throw new Error('Node "n_0_32", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_33_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_33_state, G_msg_readFloatToken(m, 0))
                N_n_0_35_rcvs_0(G_msg_floats([N_n_0_33_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_35_rcvs_0(G_msg_floats([N_n_0_33_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_33", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_33_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_33_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_33", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_35_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_13_7_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_12_7_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_9_7_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_11_7_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 5
                            ) {
                                N_n_8_7_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_35", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_13_7_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_31_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_13_7_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_13_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_31_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_0_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_1_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_2_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_3_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    N_n_0_34_rcvs_1(m)
                    return
                
                            throw new Error('Node "n_0_31", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_1_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_1_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_1_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_1_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_2_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_2_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_2_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_2_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_3_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_3_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_3_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_3_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_12_7_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_30_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_12_7_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_12_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_30_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_4_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_5_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_6_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_20_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    N_n_0_34_rcvs_1(m)
                    return
                
                            throw new Error('Node "n_0_30", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_4_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_4_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_4_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_4_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_5_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_5_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_5_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_5_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_6_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_6_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_6_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_6_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_20_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_20_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_20_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_20_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_20", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_9_7_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_29_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_9_7_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_9_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_29_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_7_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_8_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_9_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_11_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 5
                            ) {
                                N_n_0_10_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    N_n_0_34_rcvs_1(m)
                    return
                
                            throw new Error('Node "n_0_29", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_7_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_7_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_7_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_7_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_8_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_8_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_8_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_8_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_9_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_9_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_9_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_9_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_11_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_11_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_11_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_11_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_10_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_10_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_10_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_10_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_10", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_11_7_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_28_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_11_7_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_11_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_28_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_19_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_13_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_14_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_12_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    N_n_0_34_rcvs_1(m)
                    return
                
                            throw new Error('Node "n_0_28", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_19_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_19_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_19_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_19_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_13_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_13_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_13_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_13_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_14_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_14_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_14_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_14_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_14", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_12_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_12_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_12_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_12_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_8_7_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_27_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_8_7_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_8_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_27_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_15_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_17_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_18_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_16_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    N_n_0_34_rcvs_1(m)
                    return
                
                            throw new Error('Node "n_0_27", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_15_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_15_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_15_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_15_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_17_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_17_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_17_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_17_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_18_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_18_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_18_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_18_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_18", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_16_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_16_state, G_msg_readFloatToken(m, 0))
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_16_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_34_rcvs_1(G_msg_floats([N_n_0_16_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_37_rcvs_0(m) {
                            
            N_n_0_40_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_0_38_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_0_37", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_38_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_39_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_0_38_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_0_38", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_39_rcvs_0(m) {
                            
                    if (N_n_0_39_state.filterType === G_msg_STRING_TOKEN) {
                        if (
                            (N_n_0_39_state.stringFilter === 'float'
                                && G_msg_isFloatToken(m, 0))
                            || (N_n_0_39_state.stringFilter === 'symbol'
                                && G_msg_isStringToken(m, 0))
                            || (N_n_0_39_state.stringFilter === 'list'
                                && G_msg_getLength(m) > 1)
                            || (N_n_0_39_state.stringFilter === 'bang' 
                                && G_bangUtils_isBang(m))
                        ) {
                            N_n_0_40_rcvs_0(m)
                            return
                        
                        } else if (
                            G_msg_isStringToken(m, 0)
                            && G_msg_readStringToken(m, 0) === N_n_0_39_state.stringFilter
                        ) {
                            N_n_0_40_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                            return
                        }
    
                    } else if (
                        G_msg_isFloatToken(m, 0)
                        && G_msg_readFloatToken(m, 0) === N_n_0_39_state.floatFilter
                    ) {
                        N_n_0_40_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                        return
                    }
                
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                return
                
                            throw new Error('Node "n_0_39", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_40_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_40_state, G_msg_readFloatToken(m, 0))
                N_n_0_41_rcvs_0(G_msg_floats([N_n_0_40_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_41_rcvs_0(G_msg_floats([N_n_0_40_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_40", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_40_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_40_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_40", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_41_rcvs_0(m) {
                            
            N_n_0_52_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_0_50_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_0_48_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_0_42_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_0_41", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_42_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_43_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_49_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_49_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_42", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_43_rcvs_0(m) {
                            
            N_n_10_7_rcvs_0(G_bangUtils_bang())
N_n_0_44_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_0_43", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_44_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_44_state, G_msg_readFloatToken(m, 0))
                N_n_0_54_rcvs_0(G_msg_floats([N_n_0_44_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_54_rcvs_0(G_msg_floats([N_n_0_44_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_44", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_44_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_44_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_44", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_54_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_55_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_56_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_57_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_58_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 5
                            ) {
                                N_n_0_59_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_54", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_55_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_55_state, G_msg_readFloatToken(m, 0))
                N_n_0_60_rcvs_0(G_msg_floats([N_n_0_55_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_60_rcvs_0(G_msg_floats([N_n_0_55_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_55", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_55_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_55_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_55", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_60_rcvs_0(m) {
                            
            G_msgBuses_publish(N_n_0_60_state.busName, m)
            return
        
                            throw new Error('Node "n_0_60", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_56_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_56_state, G_msg_readFloatToken(m, 0))
                N_n_0_60_rcvs_0(G_msg_floats([N_n_0_56_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_60_rcvs_0(G_msg_floats([N_n_0_56_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_56", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_56_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_56_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_56", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_57_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_57_state, G_msg_readFloatToken(m, 0))
                N_n_0_60_rcvs_0(G_msg_floats([N_n_0_57_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_60_rcvs_0(G_msg_floats([N_n_0_57_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_57", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_57_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_57_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_57", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_58_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_58_state, G_msg_readFloatToken(m, 0))
                N_n_0_60_rcvs_0(G_msg_floats([N_n_0_58_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_60_rcvs_0(G_msg_floats([N_n_0_58_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_58", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_58_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_58_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_58", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_59_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_59_state, G_msg_readFloatToken(m, 0))
                N_n_0_60_rcvs_0(G_msg_floats([N_n_0_59_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_60_rcvs_0(G_msg_floats([N_n_0_59_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_59", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_59_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_59_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_59", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_10_7_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_45_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_10_7_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_10_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_45_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_0_45_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_47_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_45", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_46_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_46_state, G_msg_readFloatToken(m, 0))
                N_n_0_48_rcvs_1(G_msg_floats([N_n_0_46_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_48_rcvs_1(G_msg_floats([N_n_0_46_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_46", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_48_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_48_state, G_msg_readFloatToken(m, 0))
                        N_n_0_44_rcvs_1(G_msg_floats([N_n_0_48_state.leftOp + N_n_0_48_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_44_rcvs_1(G_msg_floats([N_n_0_48_state.leftOp + N_n_0_48_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_48", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_48_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_0_48_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_48", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_14_7_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_53_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_14_7_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_14_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_53_rcvs_0(m) {
                            
                    if (N_n_0_53_state.filterType === G_msg_STRING_TOKEN) {
                        if (
                            (N_n_0_53_state.stringFilter === 'float'
                                && G_msg_isFloatToken(m, 0))
                            || (N_n_0_53_state.stringFilter === 'symbol'
                                && G_msg_isStringToken(m, 0))
                            || (N_n_0_53_state.stringFilter === 'list'
                                && G_msg_getLength(m) > 1)
                            || (N_n_0_53_state.stringFilter === 'bang' 
                                && G_bangUtils_isBang(m))
                        ) {
                            N_n_0_51_rcvs_0(m)
                            return
                        
                        } else if (
                            G_msg_isStringToken(m, 0)
                            && G_msg_readStringToken(m, 0) === N_n_0_53_state.stringFilter
                        ) {
                            N_n_0_51_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                            return
                        }
    
                    } else if (
                        G_msg_isFloatToken(m, 0)
                        && G_msg_readFloatToken(m, 0) === N_n_0_53_state.floatFilter
                    ) {
                        N_n_0_51_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                        return
                    }
                
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                return
                
                            throw new Error('Node "n_0_53", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_51_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_51_state, G_msg_readFloatToken(m, 0))
                N_n_0_61_rcvs_0(G_msg_floats([N_n_0_51_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_61_rcvs_0(G_msg_floats([N_n_0_51_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_51", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_51_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_51_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_51", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_61_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_62_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_63_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_64_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_65_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 5
                            ) {
                                N_n_0_66_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_61", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_62_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_62_state, G_msg_readFloatToken(m, 0))
                N_n_0_67_rcvs_0(G_msg_floats([N_n_0_62_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_67_rcvs_0(G_msg_floats([N_n_0_62_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_62", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_62_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_62_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_62", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_67_rcvs_0(m) {
                            
            G_msgBuses_publish(N_n_0_67_state.busName, m)
            return
        
                            throw new Error('Node "n_0_67", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_63_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_63_state, G_msg_readFloatToken(m, 0))
                N_n_0_67_rcvs_0(G_msg_floats([N_n_0_63_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_67_rcvs_0(G_msg_floats([N_n_0_63_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_63", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_63_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_63_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_63", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_64_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_64_state, G_msg_readFloatToken(m, 0))
                N_n_0_67_rcvs_0(G_msg_floats([N_n_0_64_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_67_rcvs_0(G_msg_floats([N_n_0_64_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_64", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_64_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_64_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_64", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_65_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_65_state, G_msg_readFloatToken(m, 0))
                N_n_0_67_rcvs_0(G_msg_floats([N_n_0_65_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_67_rcvs_0(G_msg_floats([N_n_0_65_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_65", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_65_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_65_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_65", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_66_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_66_state, G_msg_readFloatToken(m, 0))
                N_n_0_67_rcvs_0(G_msg_floats([N_n_0_66_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_67_rcvs_0(G_msg_floats([N_n_0_66_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_66", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_66_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_66_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_66", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_47_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_47_state, G_msg_readFloatToken(m, 0))
                N_n_0_48_rcvs_1(G_msg_floats([N_n_0_47_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_48_rcvs_1(G_msg_floats([N_n_0_47_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_47", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_49_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_49_state, G_msg_readFloatToken(m, 0))
                N_n_0_54_rcvs_0(G_msg_floats([N_n_0_49_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_54_rcvs_0(G_msg_floats([N_n_0_49_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_49", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_49_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_49_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_49", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_50_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_50_state, G_msg_readFloatToken(m, 0))
                        N_n_0_49_rcvs_1(G_msg_floats([N_n_0_50_state.leftOp + N_n_0_50_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_49_rcvs_1(G_msg_floats([N_n_0_50_state.leftOp + N_n_0_50_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_50", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_52_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_52_state, G_msg_readFloatToken(m, 0))
                        N_n_0_51_rcvs_1(G_msg_floats([N_n_0_52_state.leftOp + N_n_0_52_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_51_rcvs_1(G_msg_floats([N_n_0_52_state.leftOp + N_n_0_52_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_52", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_70_rcvs_0(m) {
                            
                NT_tgl_receiveMessage(N_n_0_70_state, m)
                return
            
                            throw new Error('Node "n_0_70", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_70_0_rcvs_0(m) {
                            
                IO_snd_n_0_70_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_70_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_1_18_rcvs_0(m) {
                            
            N_n_1_21_rcvs_0(G_bangUtils_bang())
N_n_1_17_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_1_16_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_1_18", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_16_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_1_16_state, G_msg_readFloatToken(m, 0))
                N_n_1_16_snds_0(G_msg_floats([N_n_1_16_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_1_16_snds_0(G_msg_floats([N_n_1_16_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_1_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_1_16_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_1_16_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_1_16", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_19_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_1_19_state, G_msg_readFloatToken(m, 0))
                        N_n_1_16_rcvs_1(G_msg_floats([N_n_1_19_state.leftOp + N_n_1_19_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_16_rcvs_1(G_msg_floats([N_n_1_19_state.leftOp + N_n_1_19_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_1_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_20_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_modlegacy_setLeft(N_n_1_20_state, G_msg_readFloatToken(m, 0))
                        N_n_1_17_rcvs_0(G_msg_floats([N_n_1_20_state.leftOp % N_n_1_20_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_17_rcvs_0(G_msg_floats([N_n_1_20_state.leftOp % N_n_1_20_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_1_20", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_17_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_1_17_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_1_17_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_1_17_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_1_17_state.floatValues[1])
G_msg_writeFloatToken(messageOut, 2, N_n_1_17_state.floatValues[2])
    
            N_n_1_23_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_1_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_1_17_rcvs_1(m) {
                            
                        N_n_1_17_state.floatValues[1] = G_tokenConversion_toFloat(m, 0)
                        return
                    
                            throw new Error('Node "n_1_17", inlet "1", unsupported message : ' + G_msg_display(m))
                        }
function N_n_1_17_rcvs_2(m) {
                            
                        N_n_1_17_state.floatValues[2] = G_tokenConversion_toFloat(m, 0)
                        return
                    
                            throw new Error('Node "n_1_17", inlet "2", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_23_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_1_15_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_1_39_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_1_55_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_1_23", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_15_rcvs_0(m) {
                            
            
                    if (
                        G_msg_getLength(m) >= 2
                    ) {
                        if (G_msg_getTokenType(m, 1) === G_msg_FLOAT_TOKEN) {
                            N_n_1_11_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 1)]))
                        } else {
                            console.log('unpack : invalid token type index 1')
                        }
                    }
                

                    if (
                        G_msg_getLength(m) >= 1
                    ) {
                        if (G_msg_getTokenType(m, 0) === G_msg_FLOAT_TOKEN) {
                            N_n_1_56_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 0)]))
                        } else {
                            console.log('unpack : invalid token type index 0')
                        }
                    }
                
            return
        
                            throw new Error('Node "n_1_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_56_rcvs_0(m) {
                            
            N_n_1_13_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_1_0_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_1_56", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_0_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_1_1_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_1_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_1_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_1_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_1_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_1_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_1_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_1_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_13_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_1_13_state, G_msg_readFloatToken(m, 0))
                        N_n_1_3_rcvs_0(G_msg_floats([N_n_1_13_state.leftOp + N_n_1_13_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_3_rcvs_0(G_msg_floats([N_n_1_13_state.leftOp + N_n_1_13_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_1_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_3_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_1_2_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_1_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_2_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_2_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_2_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_1_2_0_sig_outs_0 = 0
function N_m_n_1_2_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_2_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_2_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_11_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_1_11_state, G_msg_readFloatToken(m, 0))
                        N_n_1_9_rcvs_0(G_msg_floats([N_n_1_11_state.rightOp !== 0 ? N_n_1_11_state.leftOp / N_n_1_11_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_9_rcvs_0(G_msg_floats([N_n_1_11_state.rightOp !== 0 ? N_n_1_11_state.leftOp / N_n_1_11_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_1_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_9_rcvs_0(m) {
                            
            N_n_1_8_rcvs_0(G_bangUtils_bang())
N_n_1_63_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_1_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_63_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_1_63_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_1_63_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_1_63_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_1_63_state.floatValues[1])
    
            N_n_1_5_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_1_63", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_1_5_outs_0 = 0
function N_n_1_5_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_1_5_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_1_5_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_1_5_state)
                return
    
            }
        
                            throw new Error('Node "n_1_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_8_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_1_8_state, 
                            () => N_n_1_12_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_1_8_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_1_8_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_1_8_state,
                        () => N_n_1_12_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_1_8_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_1_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_12_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_1_12_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_1_12_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_1_12_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_1_12_state.floatValues[1])
    
            N_n_1_5_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_1_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_39_rcvs_0(m) {
                            
            
                    if (
                        G_msg_getLength(m) >= 2
                    ) {
                        if (G_msg_getTokenType(m, 1) === G_msg_FLOAT_TOKEN) {
                            N_n_1_35_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 1)]))
                        } else {
                            console.log('unpack : invalid token type index 1')
                        }
                    }
                

                    if (
                        G_msg_getLength(m) >= 1
                    ) {
                        if (G_msg_getTokenType(m, 0) === G_msg_FLOAT_TOKEN) {
                            N_n_1_57_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 0)]))
                        } else {
                            console.log('unpack : invalid token type index 0')
                        }
                    }
                
            return
        
                            throw new Error('Node "n_1_39", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_57_rcvs_0(m) {
                            
            N_n_1_37_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_1_24_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_1_57", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_24_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_1_25_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_1_24", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_25_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_25_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_25_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_25_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_25_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_25_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_37_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_1_37_state, G_msg_readFloatToken(m, 0))
                        N_n_1_27_rcvs_0(G_msg_floats([N_n_1_37_state.leftOp + N_n_1_37_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_27_rcvs_0(G_msg_floats([N_n_1_37_state.leftOp + N_n_1_37_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_1_37", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_27_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_1_26_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_1_27", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_26_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_26_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_26_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_1_26_0_sig_outs_0 = 0
function N_m_n_1_26_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_26_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_26_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_35_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_1_35_state, G_msg_readFloatToken(m, 0))
                        N_n_1_33_rcvs_0(G_msg_floats([N_n_1_35_state.rightOp !== 0 ? N_n_1_35_state.leftOp / N_n_1_35_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_33_rcvs_0(G_msg_floats([N_n_1_35_state.rightOp !== 0 ? N_n_1_35_state.leftOp / N_n_1_35_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_1_35", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_33_rcvs_0(m) {
                            
            N_n_1_32_rcvs_0(G_bangUtils_bang())
N_n_1_64_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_1_33", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_64_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_1_64_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_1_64_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_1_64_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_1_64_state.floatValues[1])
    
            N_n_1_29_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_1_64", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_1_29_outs_0 = 0
function N_n_1_29_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_1_29_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_1_29_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_1_29_state)
                return
    
            }
        
                            throw new Error('Node "n_1_29", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_32_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_1_32_state, 
                            () => N_n_1_36_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_1_32_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_1_32_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_1_32_state,
                        () => N_n_1_36_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_1_32_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_1_32", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_36_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_1_36_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_1_36_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_1_36_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_1_36_state.floatValues[1])
    
            N_n_1_29_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_1_36", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_55_rcvs_0(m) {
                            
            
                    if (
                        G_msg_getLength(m) >= 2
                    ) {
                        if (G_msg_getTokenType(m, 1) === G_msg_FLOAT_TOKEN) {
                            N_n_1_51_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 1)]))
                        } else {
                            console.log('unpack : invalid token type index 1')
                        }
                    }
                

                    if (
                        G_msg_getLength(m) >= 1
                    ) {
                        if (G_msg_getTokenType(m, 0) === G_msg_FLOAT_TOKEN) {
                            N_n_1_58_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 0)]))
                        } else {
                            console.log('unpack : invalid token type index 0')
                        }
                    }
                
            return
        
                            throw new Error('Node "n_1_55", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_58_rcvs_0(m) {
                            
            N_n_1_53_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_1_40_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_1_58", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_40_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_1_41_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_1_40", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_41_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_41_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_41_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_41_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_41_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_41_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_53_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_1_53_state, G_msg_readFloatToken(m, 0))
                        N_n_1_43_rcvs_0(G_msg_floats([N_n_1_53_state.leftOp + N_n_1_53_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_43_rcvs_0(G_msg_floats([N_n_1_53_state.leftOp + N_n_1_53_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_1_53", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_43_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_1_42_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_1_43", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_42_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_42_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_42_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_1_42_0_sig_outs_0 = 0
function N_m_n_1_42_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_42_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_42_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_51_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_1_51_state, G_msg_readFloatToken(m, 0))
                        N_n_1_49_rcvs_0(G_msg_floats([N_n_1_51_state.rightOp !== 0 ? N_n_1_51_state.leftOp / N_n_1_51_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_49_rcvs_0(G_msg_floats([N_n_1_51_state.rightOp !== 0 ? N_n_1_51_state.leftOp / N_n_1_51_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_1_51", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_49_rcvs_0(m) {
                            
            N_n_1_48_rcvs_0(G_bangUtils_bang())
N_n_1_65_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_1_49", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_65_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_1_65_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_1_65_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_1_65_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_1_65_state.floatValues[1])
    
            N_n_1_45_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_1_65", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_1_45_outs_0 = 0
function N_n_1_45_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_1_45_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_1_45_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_1_45_state)
                return
    
            }
        
                            throw new Error('Node "n_1_45", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_48_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_1_48_state, 
                            () => N_n_1_52_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_1_48_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_1_48_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_1_48_state,
                        () => N_n_1_52_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_1_48_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_1_48", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_52_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_1_52_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_1_52_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_1_52_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_1_52_state.floatValues[1])
    
            N_n_1_45_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_1_52", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_21_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_1_22_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_1_21_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_1_21", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_22_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_1_22_state, G_msg_readFloatToken(m, 0))
                        N_n_1_17_rcvs_2(G_msg_floats([N_n_1_22_state.leftOp + N_n_1_22_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_1_17_rcvs_2(G_msg_floats([N_n_1_22_state.leftOp + N_n_1_22_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_1_22", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_71_0_rcvs_0(m) {
                            
                IO_snd_n_0_71_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_71_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_2_18_rcvs_0(m) {
                            
            N_n_2_21_rcvs_0(G_bangUtils_bang())
N_n_2_17_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_2_16_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_2_18", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_16_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_2_16_state, G_msg_readFloatToken(m, 0))
                N_n_2_16_snds_0(G_msg_floats([N_n_2_16_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_2_16_snds_0(G_msg_floats([N_n_2_16_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_2_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_2_16_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_2_16_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_2_16", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_19_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_2_19_state, G_msg_readFloatToken(m, 0))
                        N_n_2_16_rcvs_1(G_msg_floats([N_n_2_19_state.leftOp + N_n_2_19_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_16_rcvs_1(G_msg_floats([N_n_2_19_state.leftOp + N_n_2_19_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_2_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_20_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_modlegacy_setLeft(N_n_2_20_state, G_msg_readFloatToken(m, 0))
                        N_n_2_17_rcvs_0(G_msg_floats([N_n_2_20_state.leftOp % N_n_2_20_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_17_rcvs_0(G_msg_floats([N_n_2_20_state.leftOp % N_n_2_20_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_2_20", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_17_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_2_17_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_2_17_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_2_17_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_2_17_state.floatValues[1])
G_msg_writeFloatToken(messageOut, 2, N_n_2_17_state.floatValues[2])
    
            N_n_2_23_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_2_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_2_17_rcvs_1(m) {
                            
                        N_n_2_17_state.floatValues[1] = G_tokenConversion_toFloat(m, 0)
                        return
                    
                            throw new Error('Node "n_2_17", inlet "1", unsupported message : ' + G_msg_display(m))
                        }
function N_n_2_17_rcvs_2(m) {
                            
                        N_n_2_17_state.floatValues[2] = G_tokenConversion_toFloat(m, 0)
                        return
                    
                            throw new Error('Node "n_2_17", inlet "2", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_23_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_2_15_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_2_39_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_2_55_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_2_23", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_15_rcvs_0(m) {
                            
            
                    if (
                        G_msg_getLength(m) >= 2
                    ) {
                        if (G_msg_getTokenType(m, 1) === G_msg_FLOAT_TOKEN) {
                            N_n_2_11_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 1)]))
                        } else {
                            console.log('unpack : invalid token type index 1')
                        }
                    }
                

                    if (
                        G_msg_getLength(m) >= 1
                    ) {
                        if (G_msg_getTokenType(m, 0) === G_msg_FLOAT_TOKEN) {
                            N_n_2_56_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 0)]))
                        } else {
                            console.log('unpack : invalid token type index 0')
                        }
                    }
                
            return
        
                            throw new Error('Node "n_2_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_56_rcvs_0(m) {
                            
            N_n_2_13_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_2_0_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_2_56", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_0_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_2_1_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_2_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_2_1_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_2_1_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_2_1_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_2_1_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_2_1_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_2_1_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_13_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_2_13_state, G_msg_readFloatToken(m, 0))
                        N_n_2_3_rcvs_0(G_msg_floats([N_n_2_13_state.leftOp + N_n_2_13_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_3_rcvs_0(G_msg_floats([N_n_2_13_state.leftOp + N_n_2_13_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_2_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_3_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_2_2_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_2_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_2_2_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_2_2_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_2_2_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_2_2_0_sig_outs_0 = 0
function N_m_n_2_2_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_2_2_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_2_2_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_11_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_2_11_state, G_msg_readFloatToken(m, 0))
                        N_n_2_9_rcvs_0(G_msg_floats([N_n_2_11_state.rightOp !== 0 ? N_n_2_11_state.leftOp / N_n_2_11_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_9_rcvs_0(G_msg_floats([N_n_2_11_state.rightOp !== 0 ? N_n_2_11_state.leftOp / N_n_2_11_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_2_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_9_rcvs_0(m) {
                            
            N_n_2_8_rcvs_0(G_bangUtils_bang())
N_n_2_63_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_2_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_63_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_2_63_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_2_63_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_2_63_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_2_63_state.floatValues[1])
    
            N_n_2_5_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_2_63", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_2_5_outs_0 = 0
function N_n_2_5_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_2_5_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_2_5_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_2_5_state)
                return
    
            }
        
                            throw new Error('Node "n_2_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_8_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_2_8_state, 
                            () => N_n_2_12_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_2_8_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_2_8_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_2_8_state,
                        () => N_n_2_12_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_2_8_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_2_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_12_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_2_12_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_2_12_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_2_12_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_2_12_state.floatValues[1])
    
            N_n_2_5_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_2_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_39_rcvs_0(m) {
                            
            
                    if (
                        G_msg_getLength(m) >= 2
                    ) {
                        if (G_msg_getTokenType(m, 1) === G_msg_FLOAT_TOKEN) {
                            N_n_2_35_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 1)]))
                        } else {
                            console.log('unpack : invalid token type index 1')
                        }
                    }
                

                    if (
                        G_msg_getLength(m) >= 1
                    ) {
                        if (G_msg_getTokenType(m, 0) === G_msg_FLOAT_TOKEN) {
                            N_n_2_57_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 0)]))
                        } else {
                            console.log('unpack : invalid token type index 0')
                        }
                    }
                
            return
        
                            throw new Error('Node "n_2_39", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_57_rcvs_0(m) {
                            
            N_n_2_37_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_2_24_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_2_57", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_24_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_2_25_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_2_24", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_2_25_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_2_25_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_2_25_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_2_25_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_2_25_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_2_25_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_37_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_2_37_state, G_msg_readFloatToken(m, 0))
                        N_n_2_27_rcvs_0(G_msg_floats([N_n_2_37_state.leftOp + N_n_2_37_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_27_rcvs_0(G_msg_floats([N_n_2_37_state.leftOp + N_n_2_37_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_2_37", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_27_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_2_26_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_2_27", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_2_26_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_2_26_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_2_26_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_2_26_0_sig_outs_0 = 0
function N_m_n_2_26_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_2_26_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_2_26_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_35_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_2_35_state, G_msg_readFloatToken(m, 0))
                        N_n_2_33_rcvs_0(G_msg_floats([N_n_2_35_state.rightOp !== 0 ? N_n_2_35_state.leftOp / N_n_2_35_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_33_rcvs_0(G_msg_floats([N_n_2_35_state.rightOp !== 0 ? N_n_2_35_state.leftOp / N_n_2_35_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_2_35", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_33_rcvs_0(m) {
                            
            N_n_2_32_rcvs_0(G_bangUtils_bang())
N_n_2_64_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_2_33", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_64_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_2_64_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_2_64_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_2_64_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_2_64_state.floatValues[1])
    
            N_n_2_29_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_2_64", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_2_29_outs_0 = 0
function N_n_2_29_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_2_29_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_2_29_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_2_29_state)
                return
    
            }
        
                            throw new Error('Node "n_2_29", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_32_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_2_32_state, 
                            () => N_n_2_36_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_2_32_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_2_32_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_2_32_state,
                        () => N_n_2_36_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_2_32_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_2_32", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_36_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_2_36_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_2_36_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_2_36_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_2_36_state.floatValues[1])
    
            N_n_2_29_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_2_36", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_55_rcvs_0(m) {
                            
            
                    if (
                        G_msg_getLength(m) >= 2
                    ) {
                        if (G_msg_getTokenType(m, 1) === G_msg_FLOAT_TOKEN) {
                            N_n_2_51_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 1)]))
                        } else {
                            console.log('unpack : invalid token type index 1')
                        }
                    }
                

                    if (
                        G_msg_getLength(m) >= 1
                    ) {
                        if (G_msg_getTokenType(m, 0) === G_msg_FLOAT_TOKEN) {
                            N_n_2_58_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 0)]))
                        } else {
                            console.log('unpack : invalid token type index 0')
                        }
                    }
                
            return
        
                            throw new Error('Node "n_2_55", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_58_rcvs_0(m) {
                            
            N_n_2_53_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_2_40_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_2_58", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_40_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_2_41_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_2_40", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_2_41_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_2_41_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_2_41_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_2_41_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_2_41_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_2_41_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_53_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_2_53_state, G_msg_readFloatToken(m, 0))
                        N_n_2_43_rcvs_0(G_msg_floats([N_n_2_53_state.leftOp + N_n_2_53_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_43_rcvs_0(G_msg_floats([N_n_2_53_state.leftOp + N_n_2_53_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_2_53", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_43_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_2_42_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_2_43", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_2_42_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_2_42_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_2_42_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_2_42_0_sig_outs_0 = 0
function N_m_n_2_42_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_2_42_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_2_42_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_51_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_2_51_state, G_msg_readFloatToken(m, 0))
                        N_n_2_49_rcvs_0(G_msg_floats([N_n_2_51_state.rightOp !== 0 ? N_n_2_51_state.leftOp / N_n_2_51_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_49_rcvs_0(G_msg_floats([N_n_2_51_state.rightOp !== 0 ? N_n_2_51_state.leftOp / N_n_2_51_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_2_51", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_49_rcvs_0(m) {
                            
            N_n_2_48_rcvs_0(G_bangUtils_bang())
N_n_2_65_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_2_49", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_65_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_2_65_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_2_65_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_2_65_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_2_65_state.floatValues[1])
    
            N_n_2_45_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_2_65", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_2_45_outs_0 = 0
function N_n_2_45_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_2_45_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_2_45_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_2_45_state)
                return
    
            }
        
                            throw new Error('Node "n_2_45", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_48_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_2_48_state, 
                            () => N_n_2_52_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_2_48_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_2_48_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_2_48_state,
                        () => N_n_2_52_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_2_48_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_2_48", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_52_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_2_52_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_2_52_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_2_52_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_2_52_state.floatValues[1])
    
            N_n_2_45_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_2_52", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_21_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_2_22_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_2_21_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_2_21", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_22_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_2_22_state, G_msg_readFloatToken(m, 0))
                        N_n_2_17_rcvs_2(G_msg_floats([N_n_2_22_state.leftOp + N_n_2_22_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_17_rcvs_2(G_msg_floats([N_n_2_22_state.leftOp + N_n_2_22_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_2_22", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_73_0_rcvs_0(m) {
                            
                IO_snd_n_0_73_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_73_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_3_18_rcvs_0(m) {
                            
            N_n_3_21_rcvs_0(G_bangUtils_bang())
N_n_3_17_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_16_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_3_18", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_16_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_3_16_state, G_msg_readFloatToken(m, 0))
                N_n_3_16_snds_0(G_msg_floats([N_n_3_16_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_3_16_snds_0(G_msg_floats([N_n_3_16_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_3_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_3_16_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_3_16_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_3_16", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_19_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_3_19_state, G_msg_readFloatToken(m, 0))
                        N_n_3_16_rcvs_1(G_msg_floats([N_n_3_19_state.leftOp + N_n_3_19_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_3_16_rcvs_1(G_msg_floats([N_n_3_19_state.leftOp + N_n_3_19_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_3_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_20_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_modlegacy_setLeft(N_n_3_20_state, G_msg_readFloatToken(m, 0))
                        N_n_3_17_rcvs_0(G_msg_floats([N_n_3_20_state.leftOp % N_n_3_20_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_3_17_rcvs_0(G_msg_floats([N_n_3_20_state.leftOp % N_n_3_20_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_3_20", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_17_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_3_17_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_3_17_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_3_17_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_3_17_state.floatValues[1])
G_msg_writeFloatToken(messageOut, 2, N_n_3_17_state.floatValues[2])
    
            N_n_3_23_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_3_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_3_17_rcvs_1(m) {
                            
                        N_n_3_17_state.floatValues[1] = G_tokenConversion_toFloat(m, 0)
                        return
                    
                            throw new Error('Node "n_3_17", inlet "1", unsupported message : ' + G_msg_display(m))
                        }
function N_n_3_17_rcvs_2(m) {
                            
                        N_n_3_17_state.floatValues[2] = G_tokenConversion_toFloat(m, 0)
                        return
                    
                            throw new Error('Node "n_3_17", inlet "2", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_23_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_3_15_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_3_39_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_3_55_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_3_23", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_15_rcvs_0(m) {
                            
            
                    if (
                        G_msg_getLength(m) >= 2
                    ) {
                        if (G_msg_getTokenType(m, 1) === G_msg_FLOAT_TOKEN) {
                            N_n_3_11_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 1)]))
                        } else {
                            console.log('unpack : invalid token type index 1')
                        }
                    }
                

                    if (
                        G_msg_getLength(m) >= 1
                    ) {
                        if (G_msg_getTokenType(m, 0) === G_msg_FLOAT_TOKEN) {
                            N_n_3_56_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 0)]))
                        } else {
                            console.log('unpack : invalid token type index 0')
                        }
                    }
                
            return
        
                            throw new Error('Node "n_3_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_56_rcvs_0(m) {
                            
            N_n_3_13_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_0_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_3_56", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_0_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_3_1_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_3_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_3_1_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_3_1_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_3_1_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_3_1_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_3_1_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_3_1_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_13_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_3_13_state, G_msg_readFloatToken(m, 0))
                        N_n_3_3_rcvs_0(G_msg_floats([N_n_3_13_state.leftOp + N_n_3_13_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_3_3_rcvs_0(G_msg_floats([N_n_3_13_state.leftOp + N_n_3_13_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_3_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_3_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_3_2_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_3_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_3_2_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_3_2_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_3_2_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_3_2_0_sig_outs_0 = 0
function N_m_n_3_2_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_3_2_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_3_2_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_11_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_3_11_state, G_msg_readFloatToken(m, 0))
                        N_n_3_9_rcvs_0(G_msg_floats([N_n_3_11_state.rightOp !== 0 ? N_n_3_11_state.leftOp / N_n_3_11_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_3_9_rcvs_0(G_msg_floats([N_n_3_11_state.rightOp !== 0 ? N_n_3_11_state.leftOp / N_n_3_11_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_3_11", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_9_rcvs_0(m) {
                            
            N_n_3_8_rcvs_0(G_bangUtils_bang())
N_n_3_63_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_3_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_63_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_3_63_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_3_63_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_3_63_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_3_63_state.floatValues[1])
    
            N_n_3_5_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_3_63", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_3_5_outs_0 = 0
function N_n_3_5_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_3_5_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_3_5_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_3_5_state)
                return
    
            }
        
                            throw new Error('Node "n_3_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_8_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_3_8_state, 
                            () => N_n_3_12_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_3_8_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_3_8_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_3_8_state,
                        () => N_n_3_12_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_3_8_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_3_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_12_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_3_12_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_3_12_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_3_12_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_3_12_state.floatValues[1])
    
            N_n_3_5_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_3_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_39_rcvs_0(m) {
                            
            
                    if (
                        G_msg_getLength(m) >= 2
                    ) {
                        if (G_msg_getTokenType(m, 1) === G_msg_FLOAT_TOKEN) {
                            N_n_3_35_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 1)]))
                        } else {
                            console.log('unpack : invalid token type index 1')
                        }
                    }
                

                    if (
                        G_msg_getLength(m) >= 1
                    ) {
                        if (G_msg_getTokenType(m, 0) === G_msg_FLOAT_TOKEN) {
                            N_n_3_57_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 0)]))
                        } else {
                            console.log('unpack : invalid token type index 0')
                        }
                    }
                
            return
        
                            throw new Error('Node "n_3_39", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_57_rcvs_0(m) {
                            
            N_n_3_37_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_24_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_3_57", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_24_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_3_25_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_3_24", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_3_25_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_3_25_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_3_25_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_3_25_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_3_25_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_3_25_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_37_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_3_37_state, G_msg_readFloatToken(m, 0))
                        N_n_3_27_rcvs_0(G_msg_floats([N_n_3_37_state.leftOp + N_n_3_37_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_3_27_rcvs_0(G_msg_floats([N_n_3_37_state.leftOp + N_n_3_37_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_3_37", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_27_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_3_26_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_3_27", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_3_26_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_3_26_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_3_26_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_3_26_0_sig_outs_0 = 0
function N_m_n_3_26_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_3_26_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_3_26_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_35_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_3_35_state, G_msg_readFloatToken(m, 0))
                        N_n_3_33_rcvs_0(G_msg_floats([N_n_3_35_state.rightOp !== 0 ? N_n_3_35_state.leftOp / N_n_3_35_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_3_33_rcvs_0(G_msg_floats([N_n_3_35_state.rightOp !== 0 ? N_n_3_35_state.leftOp / N_n_3_35_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_3_35", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_33_rcvs_0(m) {
                            
            N_n_3_32_rcvs_0(G_bangUtils_bang())
N_n_3_64_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_3_33", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_64_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_3_64_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_3_64_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_3_64_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_3_64_state.floatValues[1])
    
            N_n_3_29_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_3_64", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_3_29_outs_0 = 0
function N_n_3_29_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_3_29_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_3_29_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_3_29_state)
                return
    
            }
        
                            throw new Error('Node "n_3_29", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_32_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_3_32_state, 
                            () => N_n_3_36_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_3_32_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_3_32_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_3_32_state,
                        () => N_n_3_36_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_3_32_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_3_32", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_36_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_3_36_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_3_36_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_3_36_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_3_36_state.floatValues[1])
    
            N_n_3_29_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_3_36", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_55_rcvs_0(m) {
                            
            
                    if (
                        G_msg_getLength(m) >= 2
                    ) {
                        if (G_msg_getTokenType(m, 1) === G_msg_FLOAT_TOKEN) {
                            N_n_3_51_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 1)]))
                        } else {
                            console.log('unpack : invalid token type index 1')
                        }
                    }
                

                    if (
                        G_msg_getLength(m) >= 1
                    ) {
                        if (G_msg_getTokenType(m, 0) === G_msg_FLOAT_TOKEN) {
                            N_n_3_58_rcvs_0(G_msg_floats([G_msg_readFloatToken(m, 0)]))
                        } else {
                            console.log('unpack : invalid token type index 0')
                        }
                    }
                
            return
        
                            throw new Error('Node "n_3_55", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_58_rcvs_0(m) {
                            
            N_n_3_53_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_3_40_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_3_58", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_40_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_3_41_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_3_40", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_3_41_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_3_41_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_3_41_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_3_41_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_3_41_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_3_41_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_53_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_3_53_state, G_msg_readFloatToken(m, 0))
                        N_n_3_43_rcvs_0(G_msg_floats([N_n_3_53_state.leftOp + N_n_3_53_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_3_43_rcvs_0(G_msg_floats([N_n_3_53_state.leftOp + N_n_3_53_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_3_53", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_43_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_m_n_3_42_0__routemsg_rcvs_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_3_43", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_3_42_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_3_42_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_3_42_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_3_42_0_sig_outs_0 = 0
function N_m_n_3_42_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_3_42_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_3_42_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_51_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_3_51_state, G_msg_readFloatToken(m, 0))
                        N_n_3_49_rcvs_0(G_msg_floats([N_n_3_51_state.rightOp !== 0 ? N_n_3_51_state.leftOp / N_n_3_51_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_3_49_rcvs_0(G_msg_floats([N_n_3_51_state.rightOp !== 0 ? N_n_3_51_state.leftOp / N_n_3_51_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_3_51", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_49_rcvs_0(m) {
                            
            N_n_3_48_rcvs_0(G_bangUtils_bang())
N_n_3_65_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_3_49", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_65_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_3_65_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_3_65_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_3_65_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_3_65_state.floatValues[1])
    
            N_n_3_45_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_3_65", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_3_45_outs_0 = 0
function N_n_3_45_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_3_45_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_3_45_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_3_45_state)
                return
    
            }
        
                            throw new Error('Node "n_3_45", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_48_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_3_48_state, 
                            () => N_n_3_52_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_3_48_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_3_48_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_3_48_state,
                        () => N_n_3_52_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_3_48_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_3_48", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_52_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_3_52_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_3_52_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_3_52_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_3_52_state.floatValues[1])
    
            N_n_3_45_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_3_52", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_21_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_3_22_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_3_21_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_3_21", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_3_22_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_3_22_state, G_msg_readFloatToken(m, 0))
                        N_n_3_17_rcvs_2(G_msg_floats([N_n_3_22_state.leftOp + N_n_3_22_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_3_17_rcvs_2(G_msg_floats([N_n_3_22_state.leftOp + N_n_3_22_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_3_22", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_78_0_rcvs_0(m) {
                            
                IO_snd_n_0_78_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_78_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_91_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_91_state, G_msg_readFloatToken(m, 0))
                N_n_0_112_rcvs_0(G_msg_floats([N_n_0_91_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_112_rcvs_0(G_msg_floats([N_n_0_91_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_91", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_91_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_int_setValue(N_n_0_91_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_91", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_112_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_0_112_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_0_112_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_0_112_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_0_112_state.floatValues[1])
    
            N_n_0_111_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_0_112", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_111_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                NT_line_stopCurrentLine(N_n_0_111_state)
                switch (G_msg_getLength(m)) {
                    case 3:
                        NT_line_setGrain(N_n_0_111_state, G_msg_readFloatToken(m, 2))
                    case 2:
                        NT_line_setNextDuration(N_n_0_111_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        const targetValue = G_msg_readFloatToken(m, 0)
                        if (N_n_0_111_state.nextDurationSamp === 0) {
                            N_n_0_111_state.currentValue = targetValue
                            N_n_0_85_rcvs_0(G_msg_floats([targetValue]))
                        } else {
                            N_n_0_85_rcvs_0(G_msg_floats([N_n_0_111_state.currentValue]))
                            NT_line_setNewLine(N_n_0_111_state, targetValue)
                            NT_line_incrementTime(N_n_0_111_state, N_n_0_111_state.currentLine.dx)
                            NT_line_scheduleNextTick(N_n_0_111_state)
                        }
                        
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_stopCurrentLine(N_n_0_111_state)
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'set'
            ) {
                NT_line_stopCurrentLine(N_n_0_111_state)
                N_n_0_111_state.currentValue = G_msg_readFloatToken(m, 1)
                return
            }
        
                            throw new Error('Node "n_0_111", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_85_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_sub_setLeft(N_n_0_85_state, G_msg_readFloatToken(m, 0))
                        N_n_0_83_rcvs_0(G_msg_floats([N_n_0_85_state.leftOp - N_n_0_85_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_0_83_rcvs_0(G_msg_floats([N_n_0_85_state.leftOp - N_n_0_85_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_85", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_83_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_0_83_snds_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_0_83", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_84_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_0_84_state, G_msg_readFloatToken(m, 0))
                        N_m_n_0_89_0__routemsg_rcvs_0(G_msg_floats([N_n_0_84_state.leftOp + N_n_0_84_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_m_n_0_89_0__routemsg_rcvs_0(G_msg_floats([N_n_0_84_state.leftOp + N_n_0_84_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_0_84", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_89_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_89_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_89_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_89_0_sig_outs_0 = 0
function N_m_n_0_89_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_89_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_89_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_0_88_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_0_88_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_0_88_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_0_88_0_sig_outs_0 = 0
function N_m_n_0_88_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_0_88_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_0_88_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_93_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_93_state, G_msg_readFloatToken(m, 0))
                N_n_0_93_snds_0(G_msg_floats([N_n_0_93_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_93_snds_0(G_msg_floats([N_n_0_93_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_93", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_88_outs_0 = 0
function N_n_0_88_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_osc_t_setPhase(N_n_0_88_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_88", inlet "1", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_89_outs_0 = 0
function N_n_0_89_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_osc_t_setPhase(N_n_0_89_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_0_89", inlet "1", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_108_rcvs_0(m) {
                            
            N_n_0_91_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_0_91_rcvs_0(G_bangUtils_bang())
            return
        
                            throw new Error('Node "n_0_108", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_96_0_rcvs_0(m) {
                            
                IO_snd_n_0_96_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_96_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_115_rcvs_0(m) {
                            
            N_n_0_114_rcvs_1(G_bangUtils_bang())
N_n_0_91_rcvs_0(G_bangUtils_bang())
N_n_0_90_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_0_94_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_0_115", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_94_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_0_94_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_0_94_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_0_94_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_0_94_state.floatValues[1])
    
            N_n_0_87_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_0_94", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_0_87_outs_0 = 0
function N_n_0_87_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_0_87_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_0_87_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_0_87_state)
                return
    
            }
        
                            throw new Error('Node "n_0_87", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_90_rcvs_0(m) {
                            
                    if (N_n_0_90_state.filterType === G_msg_STRING_TOKEN) {
                        if (
                            (N_n_0_90_state.stringFilter === 'float'
                                && G_msg_isFloatToken(m, 0))
                            || (N_n_0_90_state.stringFilter === 'symbol'
                                && G_msg_isStringToken(m, 0))
                            || (N_n_0_90_state.stringFilter === 'list'
                                && G_msg_getLength(m) > 1)
                            || (N_n_0_90_state.stringFilter === 'bang' 
                                && G_bangUtils_isBang(m))
                        ) {
                            N_n_0_93_rcvs_0(m)
                            return
                        
                        } else if (
                            G_msg_isStringToken(m, 0)
                            && G_msg_readStringToken(m, 0) === N_n_0_90_state.stringFilter
                        ) {
                            N_n_0_93_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                            return
                        }
    
                    } else if (
                        G_msg_isFloatToken(m, 0)
                        && G_msg_readFloatToken(m, 0) === N_n_0_90_state.floatFilter
                    ) {
                        N_n_0_93_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                        return
                    }
                
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                return
                
                            throw new Error('Node "n_0_90", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_114_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_114_state.resetTime = FRAME
                return
    
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_0_114_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_0_114", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_0_114_rcvs_1(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_0_116_rcvs_0(G_msg_floats([toFloat(FRAME - N_n_0_114_state.resetTime) / N_n_0_114_state.sampleRatio]))
                return
            }
        
                            throw new Error('Node "n_0_114", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_116_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_int_setValue(N_n_0_116_state, G_msg_readFloatToken(m, 0))
                N_n_0_117_rcvs_0(G_msg_floats([N_n_0_116_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_0_117_rcvs_0(G_msg_floats([N_n_0_116_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_0_116", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_117_rcvs_0(m) {
                            
            G_msgBuses_publish(N_n_0_117_state.busName, m)
            return
        
                            throw new Error('Node "n_0_117", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_99_0_rcvs_0(m) {
                            
                IO_snd_n_0_99_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_99_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_100_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_100_state, m)
            return
        
                            throw new Error('Node "n_0_100", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_100_0_rcvs_0(m) {
                            
                IO_snd_n_0_100_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_100_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_101_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_101_state, m)
            return
        
                            throw new Error('Node "n_0_101", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_101_0_rcvs_0(m) {
                            
                IO_snd_n_0_101_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_101_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_102_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_102_state, m)
            return
        
                            throw new Error('Node "n_0_102", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_102_0_rcvs_0(m) {
                            
                IO_snd_n_0_102_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_102_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_103_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_103_state, m)
            return
        
                            throw new Error('Node "n_0_103", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_103_0_rcvs_0(m) {
                            
                IO_snd_n_0_103_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_103_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_104_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_104_state, m)
            return
        
                            throw new Error('Node "n_0_104", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_104_0_rcvs_0(m) {
                            
                IO_snd_n_0_104_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_104_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_105_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_105_state, m)
            return
        
                            throw new Error('Node "n_0_105", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_105_0_rcvs_0(m) {
                            
                IO_snd_n_0_105_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_105_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_106_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_0_106_state, m)
            return
        
                            throw new Error('Node "n_0_106", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_106_0_rcvs_0(m) {
                            
                IO_snd_n_0_106_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_106_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_0_69_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (
                    (G_msg_isFloatToken(m, 0) && G_msg_readFloatToken(m, 0) === 0)
                    || G_actionUtils_isAction(m, 'stop')
                ) {
                    NT_metro_stop(N_n_0_69_state)
                    return
    
                } else if (
                    G_msg_isFloatToken(m, 0)
                    || G_bangUtils_isBang(m)
                ) {
                    N_n_0_69_state.realNextTick = toFloat(FRAME)
                    NT_metro_scheduleNextTick(N_n_0_69_state)
                    return
                }
            }
        
                            throw new Error('Node "n_0_69", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_109_0_rcvs_0(m) {
                            
                IO_snd_n_0_109_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_109_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }





function N_n_4_65_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_4_65_state, G_msg_readFloatToken(m, 0))
                N_n_4_26_rcvs_0(G_msg_floats([N_n_4_65_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_4_26_rcvs_0(G_msg_floats([N_n_4_65_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_4_65", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_26_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_4_64_rcvs_0(G_msg_floats([value <= 0 ? 0 : Math.exp(Math.LN10 * (value - 100) / 20)]))
                        return
                    }
                
                            throw new Error('Node "n_4_26", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_64_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_4_64_state, G_msg_readFloatToken(m, 0))
                        N_n_4_27_rcvs_0(G_msg_floats([N_n_4_64_state.leftOp * N_n_4_64_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_4_27_rcvs_0(G_msg_floats([N_n_4_64_state.leftOp * N_n_4_64_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_4_64", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_27_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_4_27_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_4_27_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_4_27_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_4_27_state.floatValues[1])
    
            N_n_4_14_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_4_27", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_4_14_outs_0 = 0
function N_n_4_14_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_4_14_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_4_14_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_4_14_state)
                return
    
            }
        
                            throw new Error('Node "n_4_14", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_66_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_4_66_state, G_msg_readFloatToken(m, 0))
                N_n_4_33_rcvs_0(G_msg_floats([N_n_4_66_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_4_33_rcvs_0(G_msg_floats([N_n_4_66_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_4_66", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_33_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_n_4_32_rcvs_0(G_msg_floats([
                    Math.max(
                        Math.min(
                            N_n_4_33_state.maxValue, 
                            G_msg_readFloatToken(m, 0)
                        ), 
                        N_n_4_33_state.minValue
                    )
                ]))
                return
            }
        
                            throw new Error('Node "n_4_33", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_32_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_div_setLeft(N_n_4_32_state, G_msg_readFloatToken(m, 0))
                        N_n_4_28_rcvs_0(G_msg_floats([N_n_4_32_state.rightOp !== 0 ? N_n_4_32_state.leftOp / N_n_4_32_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_4_28_rcvs_0(G_msg_floats([N_n_4_32_state.rightOp !== 0 ? N_n_4_32_state.leftOp / N_n_4_32_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_4_32", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_28_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_4_28_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_4_28_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_4_28_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_4_28_state.floatValues[1])
    
            N_n_4_15_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_4_28", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_4_15_outs_0 = 0
function N_n_4_15_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_4_15_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_4_15_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_4_15_state)
                return
    
            }
        
                            throw new Error('Node "n_4_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_67_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_4_67_state, G_msg_readFloatToken(m, 0))
                N_n_4_40_rcvs_0(G_msg_floats([N_n_4_67_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_4_40_rcvs_0(G_msg_floats([N_n_4_67_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_4_67", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_40_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                const value = G_msg_readFloatToken(m, 0)
                if (value >= N_n_4_40_state.threshold) {
                    N_n_4_44_rcvs_0(G_msg_floats([value]))
                } else {
                    N_n_4_41_rcvs_0(G_msg_floats([value]))
                }
                return
            }
        
                            throw new Error('Node "n_4_40", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_41_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_4_41_state.msgSpecs.splice(0, N_n_4_41_state.msgSpecs.length - 1)
                    N_n_4_41_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_4_41_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_4_41_state.msgSpecs.length; i++) {
                        if (N_n_4_41_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_4_41_state.msgSpecs[i].send, N_n_4_41_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_4_44_rcvs_0(N_n_4_41_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_4_41", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_44_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_4_44_state, G_msg_readFloatToken(m, 0))
                N_n_4_44_snds_0(G_msg_floats([N_n_4_44_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_4_44_snds_0(G_msg_floats([N_n_4_44_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_4_44", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_4_34_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_4_34_1__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_4_34_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_4_34_1_sig_outs_0 = 0
function N_m_n_4_34_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_4_34_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_4_34_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_4_52_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_4_52_1__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_4_52_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_4_52_1_sig_outs_0 = 0
function N_m_n_4_52_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_4_52_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_4_52_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_4_56_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_4_56_1__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_4_56_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_4_56_1_sig_outs_0 = 0
function N_m_n_4_56_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_4_56_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_4_56_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_4_60_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_4_60_1__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_4_60_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_4_60_1_sig_outs_0 = 0
function N_m_n_4_60_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_4_60_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_4_60_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_68_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_4_68_state, G_msg_readFloatToken(m, 0))
                N_n_4_42_rcvs_0(G_msg_floats([N_n_4_68_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_4_42_rcvs_0(G_msg_floats([N_n_4_68_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_4_68", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_42_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_n_4_45_rcvs_0(G_msg_floats([
                    Math.max(
                        Math.min(
                            N_n_4_42_state.maxValue, 
                            G_msg_readFloatToken(m, 0)
                        ), 
                        N_n_4_42_state.minValue
                    )
                ]))
                return
            }
        
                            throw new Error('Node "n_4_42", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_45_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_4_45_state, G_msg_readFloatToken(m, 0))
                N_n_4_46_rcvs_0(G_msg_floats([N_n_4_45_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_4_46_rcvs_0(G_msg_floats([N_n_4_45_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_4_45", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_46_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mul_setLeft(N_n_4_46_state, G_msg_readFloatToken(m, 0))
                        N_n_4_47_rcvs_0(G_msg_floats([N_n_4_46_state.leftOp * N_n_4_46_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_4_47_rcvs_0(G_msg_floats([N_n_4_46_state.leftOp * N_n_4_46_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_4_46", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_4_47_rcvs_0(m) {
                            
            if (!G_bangUtils_isBang(m)) {
                for (let i = 0; i < G_msg_getLength(m); i++) {
                    N_n_4_47_state.stringValues[i] = G_tokenConversion_toString_(m, i)
                    N_n_4_47_state.floatValues[i] = G_tokenConversion_toFloat(m, i)
                }
            }
    
            const template = [G_msg_FLOAT_TOKEN,G_msg_FLOAT_TOKEN]
    
            const messageOut = G_msg_create(template)
    
            G_msg_writeFloatToken(messageOut, 0, N_n_4_47_state.floatValues[0])
G_msg_writeFloatToken(messageOut, 1, N_n_4_47_state.floatValues[1])
    
            N_n_4_48_rcvs_0(messageOut)
            return
        
                            throw new Error('Node "n_4_47", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_4_48_outs_0 = 0
function N_n_4_48_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_4_48_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_4_48_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_4_48_state)
                return
    
            }
        
                            throw new Error('Node "n_4_48", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_6_1_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_6_1_state.msgSpecs.splice(0, N_n_6_1_state.msgSpecs.length - 1)
                    N_n_6_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_6_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_6_1_state.msgSpecs.length; i++) {
                        if (N_n_6_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_6_1_state.msgSpecs[i].send, N_n_6_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_6_0_rcvs_0(N_n_6_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_6_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_0_rcvs_0(m) {
                            
                        N_n_0_36_rcvs_0(m)
                        return
                    
                            throw new Error('Node "n_6_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_36_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_0_36_snds_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_0_36_snds_1(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_0_36_snds_2(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_0_36_snds_3(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 5
                            ) {
                                N_n_0_36_snds_4(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_0_36", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_95_rcvs_0(m) {
                            
            G_msgBuses_publish(N_n_0_95_state.busName, m)
            return
        
                            throw new Error('Node "n_0_95", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_6_2_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_6_2_state.msgSpecs.splice(0, N_n_6_2_state.msgSpecs.length - 1)
                    N_n_6_2_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_6_2_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_6_2_state.msgSpecs.length; i++) {
                        if (N_n_6_2_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_6_2_state.msgSpecs[i].send, N_n_6_2_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_6_0_rcvs_0(N_n_6_2_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_6_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_6_3_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_6_3_state.msgSpecs.splice(0, N_n_6_3_state.msgSpecs.length - 1)
                    N_n_6_3_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_6_3_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_6_3_state.msgSpecs.length; i++) {
                        if (N_n_6_3_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_6_3_state.msgSpecs[i].send, N_n_6_3_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_6_0_rcvs_0(N_n_6_3_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_6_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_6_4_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_6_4_state.msgSpecs.splice(0, N_n_6_4_state.msgSpecs.length - 1)
                    N_n_6_4_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_6_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_6_4_state.msgSpecs.length; i++) {
                        if (N_n_6_4_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_6_4_state.msgSpecs[i].send, N_n_6_4_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_6_0_rcvs_0(N_n_6_4_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_6_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_6_5_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_6_5_state.msgSpecs.splice(0, N_n_6_5_state.msgSpecs.length - 1)
                    N_n_6_5_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_6_5_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_6_5_state.msgSpecs.length; i++) {
                        if (N_n_6_5_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_6_5_state.msgSpecs[i].send, N_n_6_5_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_6_0_rcvs_0(N_n_6_5_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_6_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_6_6_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_6_6_state.msgSpecs.splice(0, N_n_6_6_state.msgSpecs.length - 1)
                    N_n_6_6_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_6_6_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_6_6_state.msgSpecs.length; i++) {
                        if (N_n_6_6_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_6_6_state.msgSpecs[i].send, N_n_6_6_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_6_0_rcvs_0(N_n_6_6_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_6_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_6_7_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_6_7_state.msgSpecs.splice(0, N_n_6_7_state.msgSpecs.length - 1)
                    N_n_6_7_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_6_7_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_6_7_state.msgSpecs.length; i++) {
                        if (N_n_6_7_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_6_7_state.msgSpecs[i].send, N_n_6_7_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_6_0_rcvs_0(N_n_6_7_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_6_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_6_19_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (G_msg_isStringToken(m, 0)) {
                    const action = G_msg_readStringToken(m, 0)
                    if (action === 'bang' || action === 'start') {
                        NT_delay_scheduleDelay(
                            N_n_6_19_state, 
                            () => N_n_7_7_rcvs_0(G_bangUtils_bang()),
                            FRAME,
                        )
                        return
                    } else if (action === 'stop') {
                        NT_delay_stop(N_n_6_19_state)
                        return
                    }
                    
                } else if (G_msg_isFloatToken(m, 0)) {
                    NT_delay_setDelay(N_n_6_19_state, G_msg_readFloatToken(m, 0))
                    NT_delay_scheduleDelay(
                        N_n_6_19_state,
                        () => N_n_7_7_rcvs_0(G_bangUtils_bang()),
                        FRAME,
                    )
                    return 
                }
            
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'tempo'
            ) {
                N_n_6_19_state.sampleRatio = computeUnitInSamples(
                    SAMPLE_RATE, 
                    G_msg_readFloatToken(m, 1), 
                    G_msg_readStringToken(m, 2)
                )
                return
            }
        
                            throw new Error('Node "n_6_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_7_7_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_6_18_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_7_7_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_7_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_6_18_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_6_1_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_6_2_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_6_3_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_6_4_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_6_5_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 5
                            ) {
                                N_n_6_6_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 6
                            ) {
                                N_n_6_7_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_6_18", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_7_2_rcvs_0(m) {
                            
            N_n_7_5_rcvs_0(G_bangUtils_bang())
N_n_7_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_7_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_7_4_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_7_4_state, G_msg_readFloatToken(m, 0))
                        N_n_7_1_rcvs_0(G_msg_floats([N_n_7_4_state.leftOp + N_n_7_4_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_7_1_rcvs_0(G_msg_floats([N_n_7_4_state.leftOp + N_n_7_4_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_7_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_7_4_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_7_4_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_7_4", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_7_1_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_7_1_state.msgSpecs.splice(0, N_n_7_1_state.msgSpecs.length - 1)
                    N_n_7_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_7_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_7_1_state.msgSpecs.length; i++) {
                        if (N_n_7_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_7_1_state.msgSpecs[i].send, N_n_7_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_7_7_rcvs_0(N_n_7_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_7_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_7_5_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_7_4_rcvs_1(G_msg_floats([Math.floor(Math.random() * N_n_7_5_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_7_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_8_2_rcvs_0(m) {
                            
            N_n_8_5_rcvs_0(G_bangUtils_bang())
N_n_8_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_8_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_8_4_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_8_4_state, G_msg_readFloatToken(m, 0))
                        N_n_8_1_rcvs_0(G_msg_floats([N_n_8_4_state.leftOp + N_n_8_4_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_8_1_rcvs_0(G_msg_floats([N_n_8_4_state.leftOp + N_n_8_4_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_8_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_8_4_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_8_4_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_8_4", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_8_1_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_8_1_state.msgSpecs.splice(0, N_n_8_1_state.msgSpecs.length - 1)
                    N_n_8_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_8_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_8_1_state.msgSpecs.length; i++) {
                        if (N_n_8_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_8_1_state.msgSpecs[i].send, N_n_8_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_8_7_rcvs_0(N_n_8_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_8_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_8_5_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_8_4_rcvs_1(G_msg_floats([Math.floor(Math.random() * N_n_8_5_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_8_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_9_2_rcvs_0(m) {
                            
            N_n_9_5_rcvs_0(G_bangUtils_bang())
N_n_9_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_9_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_9_4_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_9_4_state, G_msg_readFloatToken(m, 0))
                        N_n_9_1_rcvs_0(G_msg_floats([N_n_9_4_state.leftOp + N_n_9_4_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_9_1_rcvs_0(G_msg_floats([N_n_9_4_state.leftOp + N_n_9_4_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_9_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_9_4_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_9_4_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_9_4", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_9_1_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_9_1_state.msgSpecs.splice(0, N_n_9_1_state.msgSpecs.length - 1)
                    N_n_9_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_9_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_9_1_state.msgSpecs.length; i++) {
                        if (N_n_9_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_9_1_state.msgSpecs[i].send, N_n_9_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_9_7_rcvs_0(N_n_9_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_9_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_9_5_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_9_4_rcvs_1(G_msg_floats([Math.floor(Math.random() * N_n_9_5_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_9_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_10_2_rcvs_0(m) {
                            
            N_n_10_5_rcvs_0(G_bangUtils_bang())
N_n_10_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_10_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_10_4_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_10_4_state, G_msg_readFloatToken(m, 0))
                        N_n_10_1_rcvs_0(G_msg_floats([N_n_10_4_state.leftOp + N_n_10_4_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_10_1_rcvs_0(G_msg_floats([N_n_10_4_state.leftOp + N_n_10_4_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_10_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_10_4_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_10_4_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_10_4", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_10_1_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_10_1_state.msgSpecs.splice(0, N_n_10_1_state.msgSpecs.length - 1)
                    N_n_10_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_10_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_10_1_state.msgSpecs.length; i++) {
                        if (N_n_10_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_10_1_state.msgSpecs[i].send, N_n_10_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_10_7_rcvs_0(N_n_10_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_10_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_10_5_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_10_4_rcvs_1(G_msg_floats([Math.floor(Math.random() * N_n_10_5_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_10_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_11_2_rcvs_0(m) {
                            
            N_n_11_5_rcvs_0(G_bangUtils_bang())
N_n_11_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_11_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_11_4_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_11_4_state, G_msg_readFloatToken(m, 0))
                        N_n_11_1_rcvs_0(G_msg_floats([N_n_11_4_state.leftOp + N_n_11_4_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_11_1_rcvs_0(G_msg_floats([N_n_11_4_state.leftOp + N_n_11_4_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_11_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_11_4_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_11_4_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_11_4", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_11_1_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_11_1_state.msgSpecs.splice(0, N_n_11_1_state.msgSpecs.length - 1)
                    N_n_11_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_11_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_11_1_state.msgSpecs.length; i++) {
                        if (N_n_11_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_11_1_state.msgSpecs[i].send, N_n_11_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_11_7_rcvs_0(N_n_11_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_11_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_11_5_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_11_4_rcvs_1(G_msg_floats([Math.floor(Math.random() * N_n_11_5_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_11_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_12_2_rcvs_0(m) {
                            
            N_n_12_5_rcvs_0(G_bangUtils_bang())
N_n_12_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_12_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_12_4_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_12_4_state, G_msg_readFloatToken(m, 0))
                        N_n_12_1_rcvs_0(G_msg_floats([N_n_12_4_state.leftOp + N_n_12_4_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_12_1_rcvs_0(G_msg_floats([N_n_12_4_state.leftOp + N_n_12_4_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_12_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_12_4_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_12_4_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_12_4", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_12_1_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_12_1_state.msgSpecs.splice(0, N_n_12_1_state.msgSpecs.length - 1)
                    N_n_12_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_12_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_12_1_state.msgSpecs.length; i++) {
                        if (N_n_12_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_12_1_state.msgSpecs[i].send, N_n_12_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_12_7_rcvs_0(N_n_12_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_12_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_12_5_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_12_4_rcvs_1(G_msg_floats([Math.floor(Math.random() * N_n_12_5_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_12_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_13_2_rcvs_0(m) {
                            
            N_n_13_5_rcvs_0(G_bangUtils_bang())
N_n_13_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_13_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_13_4_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_13_4_state, G_msg_readFloatToken(m, 0))
                        N_n_13_1_rcvs_0(G_msg_floats([N_n_13_4_state.leftOp + N_n_13_4_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_13_1_rcvs_0(G_msg_floats([N_n_13_4_state.leftOp + N_n_13_4_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_13_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_13_4_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_13_4_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_13_4", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_13_1_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_13_1_state.msgSpecs.splice(0, N_n_13_1_state.msgSpecs.length - 1)
                    N_n_13_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_13_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_13_1_state.msgSpecs.length; i++) {
                        if (N_n_13_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_13_1_state.msgSpecs[i].send, N_n_13_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_13_7_rcvs_0(N_n_13_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_13_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_13_5_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_13_4_rcvs_1(G_msg_floats([Math.floor(Math.random() * N_n_13_5_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_13_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_14_2_rcvs_0(m) {
                            
            N_n_14_5_rcvs_0(G_bangUtils_bang())
N_n_14_4_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_14_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_14_4_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_14_4_state, G_msg_readFloatToken(m, 0))
                        N_n_14_1_rcvs_0(G_msg_floats([N_n_14_4_state.leftOp + N_n_14_4_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_14_1_rcvs_0(G_msg_floats([N_n_14_4_state.leftOp + N_n_14_4_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_14_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_14_4_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_14_4_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_14_4", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_14_1_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_14_1_state.msgSpecs.splice(0, N_n_14_1_state.msgSpecs.length - 1)
                    N_n_14_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_14_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_14_1_state.msgSpecs.length; i++) {
                        if (N_n_14_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_14_1_state.msgSpecs[i].send, N_n_14_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_14_7_rcvs_0(N_n_14_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_14_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_14_5_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_14_4_rcvs_1(G_msg_floats([Math.floor(Math.random() * N_n_14_5_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_14_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }


























let N_n_1_2_outs_0 = 0







let N_n_1_4_outs_0 = 0

let N_n_1_7_outs_0 = 0





let N_n_1_26_outs_0 = 0







let N_n_1_28_outs_0 = 0

let N_n_1_31_outs_0 = 0





let N_n_1_42_outs_0 = 0







let N_n_1_44_outs_0 = 0

let N_n_1_47_outs_0 = 0









let N_n_2_2_outs_0 = 0







let N_n_2_4_outs_0 = 0

let N_n_2_7_outs_0 = 0





let N_n_2_26_outs_0 = 0







let N_n_2_28_outs_0 = 0

let N_n_2_31_outs_0 = 0





let N_n_2_42_outs_0 = 0







let N_n_2_44_outs_0 = 0

let N_n_2_47_outs_0 = 0









let N_n_3_2_outs_0 = 0







let N_n_3_4_outs_0 = 0

let N_n_3_7_outs_0 = 0





let N_n_3_26_outs_0 = 0







let N_n_3_28_outs_0 = 0

let N_n_3_31_outs_0 = 0





let N_n_3_42_outs_0 = 0







let N_n_3_44_outs_0 = 0

let N_n_3_47_outs_0 = 0























let N_n_0_81_outs_0 = 0

let N_m_n_5_14_0_sig_outs_0 = 0

let N_n_5_14_outs_0 = 0

let N_n_5_1_outs_0 = 0

let N_m_n_5_16_0_sig_outs_0 = 0

let N_n_5_16_outs_0 = 0

let N_n_5_2_outs_0 = 0

let N_m_n_5_18_0_sig_outs_0 = 0

let N_n_5_18_outs_0 = 0

let N_n_5_5_outs_0 = 0

let N_m_n_5_20_0_sig_outs_0 = 0

let N_n_5_20_outs_0 = 0

let N_n_5_7_outs_0 = 0

let N_m_n_5_24_0_sig_outs_0 = 0

let N_n_5_24_outs_0 = 0



let N_m_n_4_16_0_sig_outs_0 = 0

let N_n_4_16_outs_0 = 0

let N_n_4_34_outs_0 = 0









let N_n_4_9_outs_0 = 0





let N_m_n_5_22_0_sig_outs_0 = 0

let N_n_5_22_outs_0 = 0

let N_m_n_4_17_0_sig_outs_0 = 0

let N_n_4_17_outs_0 = 0

let N_n_4_52_outs_0 = 0









let N_n_4_10_outs_0 = 0













let N_n_4_0_outs_0 = 0

let N_m_n_4_18_0_sig_outs_0 = 0

let N_n_4_18_outs_0 = 0

let N_n_4_56_outs_0 = 0







let N_n_4_4_outs_0 = 0

let N_m_n_4_19_0_sig_outs_0 = 0

let N_n_4_19_outs_0 = 0

let N_n_4_60_outs_0 = 0







let N_n_4_2_outs_0 = 0

let N_n_4_12_outs_0 = 0





let N_n_4_13_outs_0 = 0

let N_n_4_11_outs_0 = 0



































function N_n_0_34_snds_0(m) {
                        N_n_0_21_rcvs_0(m)
N_n_0_32_rcvs_0(m)
                    }
function N_n_0_32_snds_1(m) {
                        N_n_0_33_rcvs_1(m)
N_n_0_35_rcvs_0(m)
N_n_0_37_rcvs_0(m)
                    }
function N_n_0_45_snds_0(m) {
                        N_n_0_46_rcvs_0(m)
N_n_14_7_rcvs_0(m)
                    }
function N_n_0_71_snds_0(m) {
                        N_n_1_18_rcvs_0(m)
N_n_ioSnd_n_0_71_0_rcvs_0(m)
                    }
function N_n_1_16_snds_0(m) {
                        N_n_1_19_rcvs_0(m)
N_n_1_20_rcvs_0(m)
                    }
function N_m_n_1_2_0__routemsg_snds_0(m) {
                        N_m_n_1_2_0_sig_rcvs_0(m)
COLD_0(m)
                    }
function N_m_n_1_26_0__routemsg_snds_0(m) {
                        N_m_n_1_26_0_sig_rcvs_0(m)
COLD_1(m)
                    }
function N_m_n_1_42_0__routemsg_snds_0(m) {
                        N_m_n_1_42_0_sig_rcvs_0(m)
COLD_2(m)
                    }
function N_n_0_73_snds_0(m) {
                        N_n_2_18_rcvs_0(m)
N_n_ioSnd_n_0_73_0_rcvs_0(m)
                    }
function N_n_2_16_snds_0(m) {
                        N_n_2_19_rcvs_0(m)
N_n_2_20_rcvs_0(m)
                    }
function N_m_n_2_2_0__routemsg_snds_0(m) {
                        N_m_n_2_2_0_sig_rcvs_0(m)
COLD_3(m)
                    }
function N_m_n_2_26_0__routemsg_snds_0(m) {
                        N_m_n_2_26_0_sig_rcvs_0(m)
COLD_4(m)
                    }
function N_m_n_2_42_0__routemsg_snds_0(m) {
                        N_m_n_2_42_0_sig_rcvs_0(m)
COLD_5(m)
                    }
function N_n_0_78_snds_0(m) {
                        N_n_3_18_rcvs_0(m)
N_n_ioSnd_n_0_78_0_rcvs_0(m)
                    }
function N_n_3_16_snds_0(m) {
                        N_n_3_19_rcvs_0(m)
N_n_3_20_rcvs_0(m)
                    }
function N_m_n_3_2_0__routemsg_snds_0(m) {
                        N_m_n_3_2_0_sig_rcvs_0(m)
COLD_6(m)
                    }
function N_m_n_3_26_0__routemsg_snds_0(m) {
                        N_m_n_3_26_0_sig_rcvs_0(m)
COLD_7(m)
                    }
function N_m_n_3_42_0__routemsg_snds_0(m) {
                        N_m_n_3_42_0_sig_rcvs_0(m)
COLD_8(m)
                    }
function N_n_0_83_snds_0(m) {
                        N_n_0_84_rcvs_0(m)
N_m_n_0_88_0__routemsg_rcvs_0(m)
                    }
function N_m_n_0_89_0__routemsg_snds_0(m) {
                        N_m_n_0_89_0_sig_rcvs_0(m)
COLD_20(m)
                    }
function N_m_n_0_88_0__routemsg_snds_0(m) {
                        N_m_n_0_88_0_sig_rcvs_0(m)
COLD_19(m)
                    }
function N_n_0_93_snds_0(m) {
                        N_n_0_88_rcvs_1(m)
N_n_0_89_rcvs_1(m)
                    }
function N_n_0_96_snds_0(m) {
                        N_n_0_108_rcvs_0(m)
N_n_ioSnd_n_0_96_0_rcvs_0(m)
                    }
function N_n_0_99_snds_0(m) {
                        N_n_0_115_rcvs_0(m)
N_n_ioSnd_n_0_99_0_rcvs_0(m)
                    }
function N_n_0_109_snds_0(m) {
                        N_n_0_69_rcvs_0(m)
N_n_ioSnd_n_0_109_0_rcvs_0(m)
                    }
function N_n_0_113_snds_0(m) {
                        N_n_0_91_rcvs_0(m)
N_n_0_114_rcvs_0(m)
                    }
function N_n_4_35_snds_0(m) {
                        N_n_4_65_rcvs_0(m)
N_n_4_66_rcvs_0(m)
N_n_4_67_rcvs_0(m)
N_n_4_68_rcvs_0(m)
                    }
function N_n_4_44_snds_0(m) {
                        N_m_n_4_34_1__routemsg_rcvs_0(m)
N_m_n_4_52_1__routemsg_rcvs_0(m)
N_m_n_4_56_1__routemsg_rcvs_0(m)
N_m_n_4_60_1__routemsg_rcvs_0(m)
                    }
function N_m_n_4_34_1__routemsg_snds_0(m) {
                        N_m_n_4_34_1_sig_rcvs_0(m)
COLD_15(m)
                    }
function N_m_n_4_52_1__routemsg_snds_0(m) {
                        N_m_n_4_52_1_sig_rcvs_0(m)
COLD_18(m)
                    }
function N_m_n_4_56_1__routemsg_snds_0(m) {
                        N_m_n_4_56_1_sig_rcvs_0(m)
COLD_22(m)
                    }
function N_m_n_4_60_1__routemsg_snds_0(m) {
                        N_m_n_4_60_1_sig_rcvs_0(m)
COLD_24(m)
                    }
function N_n_0_36_snds_0(m) {
                        N_n_0_22_rcvs_1(m)
N_n_0_55_rcvs_1(m)
N_n_0_62_rcvs_1(m)
                    }
function N_n_0_36_snds_1(m) {
                        N_n_0_23_rcvs_1(m)
N_n_0_56_rcvs_1(m)
N_n_0_63_rcvs_1(m)
                    }
function N_n_0_36_snds_2(m) {
                        N_n_0_24_rcvs_1(m)
N_n_0_57_rcvs_1(m)
N_n_0_64_rcvs_1(m)
N_n_0_95_rcvs_0(m)
                    }
function N_n_0_36_snds_3(m) {
                        N_n_0_25_rcvs_1(m)
N_n_0_58_rcvs_1(m)
N_n_0_65_rcvs_1(m)
                    }
function N_n_0_36_snds_4(m) {
                        N_n_0_26_rcvs_1(m)
N_n_0_59_rcvs_1(m)
N_n_0_66_rcvs_1(m)
                    }

        function COLD_0(m) {
                    N_m_n_1_2_0_sig_outs_0 = N_m_n_1_2_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_1_2_state, N_m_n_1_2_0_sig_outs_0)
                }
function COLD_1(m) {
                    N_m_n_1_26_0_sig_outs_0 = N_m_n_1_26_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_1_26_state, N_m_n_1_26_0_sig_outs_0)
                }
function COLD_2(m) {
                    N_m_n_1_42_0_sig_outs_0 = N_m_n_1_42_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_1_42_state, N_m_n_1_42_0_sig_outs_0)
                }
function COLD_3(m) {
                    N_m_n_2_2_0_sig_outs_0 = N_m_n_2_2_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_2_2_state, N_m_n_2_2_0_sig_outs_0)
                }
function COLD_4(m) {
                    N_m_n_2_26_0_sig_outs_0 = N_m_n_2_26_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_2_26_state, N_m_n_2_26_0_sig_outs_0)
                }
function COLD_5(m) {
                    N_m_n_2_42_0_sig_outs_0 = N_m_n_2_42_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_2_42_state, N_m_n_2_42_0_sig_outs_0)
                }
function COLD_6(m) {
                    N_m_n_3_2_0_sig_outs_0 = N_m_n_3_2_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_3_2_state, N_m_n_3_2_0_sig_outs_0)
                }
function COLD_7(m) {
                    N_m_n_3_26_0_sig_outs_0 = N_m_n_3_26_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_3_26_state, N_m_n_3_26_0_sig_outs_0)
                }
function COLD_8(m) {
                    N_m_n_3_42_0_sig_outs_0 = N_m_n_3_42_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_3_42_state, N_m_n_3_42_0_sig_outs_0)
                }
function COLD_9(m) {
                    N_m_n_5_14_0_sig_outs_0 = N_m_n_5_14_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_5_14_state, N_m_n_5_14_0_sig_outs_0)
                }
function COLD_10(m) {
                    N_m_n_5_16_0_sig_outs_0 = N_m_n_5_16_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_5_16_state, N_m_n_5_16_0_sig_outs_0)
                }
function COLD_11(m) {
                    N_m_n_5_18_0_sig_outs_0 = N_m_n_5_18_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_5_18_state, N_m_n_5_18_0_sig_outs_0)
                }
function COLD_12(m) {
                    N_m_n_5_20_0_sig_outs_0 = N_m_n_5_20_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_5_20_state, N_m_n_5_20_0_sig_outs_0)
                }
function COLD_13(m) {
                    N_m_n_5_24_0_sig_outs_0 = N_m_n_5_24_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_5_24_state, N_m_n_5_24_0_sig_outs_0)
                }
function COLD_14(m) {
                    N_m_n_4_16_0_sig_outs_0 = N_m_n_4_16_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_4_16_state, N_m_n_4_16_0_sig_outs_0)
                }
function COLD_15(m) {
                    N_m_n_4_34_1_sig_outs_0 = N_m_n_4_34_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_4_34_state, N_m_n_4_34_1_sig_outs_0)
                }
function COLD_16(m) {
                    N_m_n_5_22_0_sig_outs_0 = N_m_n_5_22_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_5_22_state, N_m_n_5_22_0_sig_outs_0)
                }
function COLD_17(m) {
                    N_m_n_4_17_0_sig_outs_0 = N_m_n_4_17_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_4_17_state, N_m_n_4_17_0_sig_outs_0)
                }
function COLD_18(m) {
                    N_m_n_4_52_1_sig_outs_0 = N_m_n_4_52_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_4_52_state, N_m_n_4_52_1_sig_outs_0)
                }
function COLD_19(m) {
                    N_m_n_0_88_0_sig_outs_0 = N_m_n_0_88_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_88_state, N_m_n_0_88_0_sig_outs_0)
                }
function COLD_20(m) {
                    N_m_n_0_89_0_sig_outs_0 = N_m_n_0_89_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_0_89_state, N_m_n_0_89_0_sig_outs_0)
                }
function COLD_21(m) {
                    N_m_n_4_18_0_sig_outs_0 = N_m_n_4_18_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_4_18_state, N_m_n_4_18_0_sig_outs_0)
                }
function COLD_22(m) {
                    N_m_n_4_56_1_sig_outs_0 = N_m_n_4_56_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_4_56_state, N_m_n_4_56_1_sig_outs_0)
                }
function COLD_23(m) {
                    N_m_n_4_19_0_sig_outs_0 = N_m_n_4_19_0_sig_state.currentValue
                    NT_delread_t_setRawOffset(N_n_4_19_state, N_m_n_4_19_0_sig_outs_0)
                }
function COLD_24(m) {
                    N_m_n_4_60_1_sig_outs_0 = N_m_n_4_60_1_sig_state.currentValue
                    NT_lop_t_setFreq(N_n_4_60_state, N_m_n_4_60_1_sig_outs_0)
                }
        function IO_rcv_n_0_70_0(m) {
                    N_n_0_70_rcvs_0(m)
                }
function IO_rcv_n_0_100_0(m) {
                    N_n_0_100_rcvs_0(m)
                }
function IO_rcv_n_0_101_0(m) {
                    N_n_0_101_rcvs_0(m)
                }
function IO_rcv_n_0_102_0(m) {
                    N_n_0_102_rcvs_0(m)
                }
function IO_rcv_n_0_103_0(m) {
                    N_n_0_103_rcvs_0(m)
                }
function IO_rcv_n_0_104_0(m) {
                    N_n_0_104_rcvs_0(m)
                }
function IO_rcv_n_0_105_0(m) {
                    N_n_0_105_rcvs_0(m)
                }
function IO_rcv_n_0_106_0(m) {
                    N_n_0_106_rcvs_0(m)
                }
function IO_rcv_n_0_60_0(m) {
                    N_n_0_60_rcvs_0(m)
                }
function IO_rcv_n_0_67_0(m) {
                    N_n_0_67_rcvs_0(m)
                }
function IO_rcv_n_0_68_0(m) {
                    N_n_0_68_rcvs_0(m)
                }
function IO_rcv_n_0_95_0(m) {
                    N_n_0_95_rcvs_0(m)
                }
function IO_rcv_n_0_117_0(m) {
                    N_n_0_117_rcvs_0(m)
                }
        const IO_snd_n_0_70_0 = (m) => {exports.io.messageSenders['n_0_70']['0'](m)}
const IO_snd_n_0_100_0 = (m) => {exports.io.messageSenders['n_0_100']['0'](m)}
const IO_snd_n_0_101_0 = (m) => {exports.io.messageSenders['n_0_101']['0'](m)}
const IO_snd_n_0_102_0 = (m) => {exports.io.messageSenders['n_0_102']['0'](m)}
const IO_snd_n_0_103_0 = (m) => {exports.io.messageSenders['n_0_103']['0'](m)}
const IO_snd_n_0_104_0 = (m) => {exports.io.messageSenders['n_0_104']['0'](m)}
const IO_snd_n_0_105_0 = (m) => {exports.io.messageSenders['n_0_105']['0'](m)}
const IO_snd_n_0_106_0 = (m) => {exports.io.messageSenders['n_0_106']['0'](m)}
const IO_snd_n_0_71_0 = (m) => {exports.io.messageSenders['n_0_71']['0'](m)}
const IO_snd_n_0_73_0 = (m) => {exports.io.messageSenders['n_0_73']['0'](m)}
const IO_snd_n_0_78_0 = (m) => {exports.io.messageSenders['n_0_78']['0'](m)}
const IO_snd_n_0_96_0 = (m) => {exports.io.messageSenders['n_0_96']['0'](m)}
const IO_snd_n_0_99_0 = (m) => {exports.io.messageSenders['n_0_99']['0'](m)}
const IO_snd_n_0_109_0 = (m) => {exports.io.messageSenders['n_0_109']['0'](m)}

        const exports = {
            metadata: {"libVersion":"0.1.0","customMetadata":{"pdNodes":{"0":{"70":{"id":"70","type":"tgl","args":[1,0,0,"","start"],"nodeClass":"control","layout":{"x":35,"y":30,"size":18,"label":"start/stop","labelX":24,"labelY":10,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"100":{"id":"100","type":"bng","args":[0,"","giaale"],"nodeClass":"control","layout":{"x":35,"y":53,"size":18,"hold":250,"interrupt":50,"label":"get\\ giaale","labelX":24,"labelY":8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"101":{"id":"101","type":"bng","args":[0,"","mera"],"nodeClass":"control","layout":{"x":35,"y":76,"size":18,"hold":250,"interrupt":50,"label":"get\\ mera","labelX":24,"labelY":8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"102":{"id":"102","type":"bng","args":[0,"","poan"],"nodeClass":"control","layout":{"x":35,"y":99,"size":18,"hold":250,"interrupt":50,"label":"get\\ poan","labelX":24,"labelY":8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"103":{"id":"103","type":"bng","args":[0,"","maisia"],"nodeClass":"control","layout":{"x":35,"y":122,"size":18,"hold":250,"interrupt":50,"label":"get\\ maisia","labelX":24,"labelY":8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"104":{"id":"104","type":"bng","args":[0,"","bagat"],"nodeClass":"control","layout":{"x":35,"y":145,"size":18,"hold":250,"interrupt":50,"label":"get\\ bagat","labelX":24,"labelY":8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"105":{"id":"105","type":"bng","args":[0,"","mazand"],"nodeClass":"control","layout":{"x":35,"y":168,"size":18,"hold":250,"interrupt":50,"label":"get\\ mazand","labelX":24,"labelY":8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}},"106":{"id":"106","type":"bng","args":[0,"","rastad"],"nodeClass":"control","layout":{"x":35,"y":191,"size":18,"hold":250,"interrupt":50,"label":"get\\ rastad","labelX":24,"labelY":8,"labelFont":"0","labelFontSize":10,"bgColor":"#fcfcfc","fgColor":"#000000","labelColor":"#000000"}}}},"graph":{"n_0_70":{"id":"n_0_70","type":"tgl","args":{"minValue":0,"maxValue":1,"sendBusName":"start","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_70_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_70_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_100":{"id":"n_0_100","type":"bang","args":{"outputOnLoad":false,"sendBusName":"giaale","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_100_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_100_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_101":{"id":"n_0_101","type":"bang","args":{"outputOnLoad":false,"sendBusName":"mera","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_101_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_101_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_102":{"id":"n_0_102","type":"bang","args":{"outputOnLoad":false,"sendBusName":"poan","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_102_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_102_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_103":{"id":"n_0_103","type":"bang","args":{"outputOnLoad":false,"sendBusName":"maisia","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_103_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_103_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_104":{"id":"n_0_104","type":"bang","args":{"outputOnLoad":false,"sendBusName":"bagat","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_104_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_104_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_105":{"id":"n_0_105","type":"bang","args":{"outputOnLoad":false,"sendBusName":"mazand","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_105_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_105_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_106":{"id":"n_0_106","type":"bang","args":{"outputOnLoad":false,"sendBusName":"rastad","receiveBusName":"empty"},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_106_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_ioSnd_n_0_106_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_60":{"id":"n_0_60","type":"send","args":{"busName":"note2"},"sources":{"0":[{"nodeId":"n_0_55","portletId":"0"},{"nodeId":"n_0_56","portletId":"0"},{"nodeId":"n_0_57","portletId":"0"},{"nodeId":"n_0_58","portletId":"0"},{"nodeId":"n_0_59","portletId":"0"},{"nodeId":"n_ioRcv_n_0_60_0","portletId":"0"}]},"sinks":{},"inlets":{"0":{"type":"message","id":"0"},"1":{"type":"message","id":"1"}},"outlets":{}},"n_0_67":{"id":"n_0_67","type":"send","args":{"busName":"note3"},"sources":{"0":[{"nodeId":"n_0_62","portletId":"0"},{"nodeId":"n_0_63","portletId":"0"},{"nodeId":"n_0_64","portletId":"0"},{"nodeId":"n_0_65","portletId":"0"},{"nodeId":"n_0_66","portletId":"0"},{"nodeId":"n_ioRcv_n_0_67_0","portletId":"0"}]},"sinks":{},"inlets":{"0":{"type":"message","id":"0"},"1":{"type":"message","id":"1"}},"outlets":{}},"n_0_68":{"id":"n_0_68","type":"send","args":{"busName":"note1"},"sources":{"0":[{"nodeId":"n_0_22","portletId":"0"},{"nodeId":"n_0_23","portletId":"0"},{"nodeId":"n_0_24","portletId":"0"},{"nodeId":"n_0_25","portletId":"0"},{"nodeId":"n_0_26","portletId":"0"},{"nodeId":"n_ioRcv_n_0_68_0","portletId":"0"}]},"sinks":{},"inlets":{"0":{"type":"message","id":"0"},"1":{"type":"message","id":"1"}},"outlets":{}},"n_0_95":{"id":"n_0_95","type":"send","args":{"busName":"note4"},"sources":{"0":[{"nodeId":"n_0_36","portletId":"2"},{"nodeId":"n_ioRcv_n_0_95_0","portletId":"0"}]},"sinks":{},"inlets":{"0":{"type":"message","id":"0"},"1":{"type":"message","id":"1"}},"outlets":{}},"n_0_117":{"id":"n_0_117","type":"send","args":{"busName":"SEED"},"sources":{"0":[{"nodeId":"n_0_116","portletId":"0"},{"nodeId":"n_ioRcv_n_0_117_0","portletId":"0"}]},"sinks":{},"inlets":{"0":{"type":"message","id":"0"},"1":{"type":"message","id":"1"}},"outlets":{}},"n_0_71":{"id":"n_0_71","type":"receive","args":{"busName":"note1"},"sources":{},"sinks":{"0":[{"nodeId":"n_1_18","portletId":"0"},{"nodeId":"n_ioSnd_n_0_71_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_73":{"id":"n_0_73","type":"receive","args":{"busName":"note2"},"sources":{},"sinks":{"0":[{"nodeId":"n_2_18","portletId":"0"},{"nodeId":"n_ioSnd_n_0_73_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_78":{"id":"n_0_78","type":"receive","args":{"busName":"note3"},"sources":{},"sinks":{"0":[{"nodeId":"n_3_18","portletId":"0"},{"nodeId":"n_ioSnd_n_0_78_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_96":{"id":"n_0_96","type":"receive","args":{"busName":"note4"},"sources":{},"sinks":{"0":[{"nodeId":"n_0_108","portletId":"0"},{"nodeId":"n_ioSnd_n_0_96_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_99":{"id":"n_0_99","type":"receive","args":{"busName":"start"},"sources":{},"sinks":{"0":[{"nodeId":"n_0_115","portletId":"0"},{"nodeId":"n_ioSnd_n_0_99_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_109":{"id":"n_0_109","type":"receive","args":{"busName":"start"},"sources":{},"sinks":{"0":[{"nodeId":"n_0_69","portletId":"0"},{"nodeId":"n_ioSnd_n_0_109_0","portletId":"0"}]},"inlets":{},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true}},"pdGui":[{"nodeClass":"control","patchId":"0","pdNodeId":"70","nodeId":"n_0_70"},{"nodeClass":"control","patchId":"0","pdNodeId":"100","nodeId":"n_0_100"},{"nodeClass":"control","patchId":"0","pdNodeId":"101","nodeId":"n_0_101"},{"nodeClass":"control","patchId":"0","pdNodeId":"102","nodeId":"n_0_102"},{"nodeClass":"control","patchId":"0","pdNodeId":"103","nodeId":"n_0_103"},{"nodeClass":"control","patchId":"0","pdNodeId":"104","nodeId":"n_0_104"},{"nodeClass":"control","patchId":"0","pdNodeId":"105","nodeId":"n_0_105"},{"nodeClass":"control","patchId":"0","pdNodeId":"106","nodeId":"n_0_106"}]},"settings":{"audio":{"bitDepth":64,"channelCount":{"in":2,"out":2},"sampleRate":0,"blockSize":0},"io":{"messageReceivers":{"n_0_70":["0"],"n_0_100":["0"],"n_0_101":["0"],"n_0_102":["0"],"n_0_103":["0"],"n_0_104":["0"],"n_0_105":["0"],"n_0_106":["0"],"n_0_60":["0"],"n_0_67":["0"],"n_0_68":["0"],"n_0_95":["0"],"n_0_117":["0"]},"messageSenders":{"n_0_70":["0"],"n_0_100":["0"],"n_0_101":["0"],"n_0_102":["0"],"n_0_103":["0"],"n_0_104":["0"],"n_0_105":["0"],"n_0_106":["0"],"n_0_71":["0"],"n_0_73":["0"],"n_0_78":["0"],"n_0_96":["0"],"n_0_99":["0"],"n_0_109":["0"]}}},"compilation":{"variableNamesIndex":{"io":{"messageReceivers":{"n_0_70":{"0":"IO_rcv_n_0_70_0"},"n_0_100":{"0":"IO_rcv_n_0_100_0"},"n_0_101":{"0":"IO_rcv_n_0_101_0"},"n_0_102":{"0":"IO_rcv_n_0_102_0"},"n_0_103":{"0":"IO_rcv_n_0_103_0"},"n_0_104":{"0":"IO_rcv_n_0_104_0"},"n_0_105":{"0":"IO_rcv_n_0_105_0"},"n_0_106":{"0":"IO_rcv_n_0_106_0"},"n_0_60":{"0":"IO_rcv_n_0_60_0"},"n_0_67":{"0":"IO_rcv_n_0_67_0"},"n_0_68":{"0":"IO_rcv_n_0_68_0"},"n_0_95":{"0":"IO_rcv_n_0_95_0"},"n_0_117":{"0":"IO_rcv_n_0_117_0"}},"messageSenders":{"n_0_70":{"0":"IO_snd_n_0_70_0"},"n_0_100":{"0":"IO_snd_n_0_100_0"},"n_0_101":{"0":"IO_snd_n_0_101_0"},"n_0_102":{"0":"IO_snd_n_0_102_0"},"n_0_103":{"0":"IO_snd_n_0_103_0"},"n_0_104":{"0":"IO_snd_n_0_104_0"},"n_0_105":{"0":"IO_snd_n_0_105_0"},"n_0_106":{"0":"IO_snd_n_0_106_0"},"n_0_71":{"0":"IO_snd_n_0_71_0"},"n_0_73":{"0":"IO_snd_n_0_73_0"},"n_0_78":{"0":"IO_snd_n_0_78_0"},"n_0_96":{"0":"IO_snd_n_0_96_0"},"n_0_99":{"0":"IO_snd_n_0_99_0"},"n_0_109":{"0":"IO_snd_n_0_109_0"}}},"globals":{"commons":{"getArray":"G_commons_getArray","setArray":"G_commons_setArray"}}}}},
            initialize: (sampleRate, blockSize) => {
                exports.metadata.settings.audio.sampleRate = sampleRate
                exports.metadata.settings.audio.blockSize = blockSize
                SAMPLE_RATE = sampleRate
                BLOCK_SIZE = blockSize

                
            NT_int_setValue(N_n_0_0_state, 1)
        

            NT_int_setValue(N_n_0_34_state, 1)
        


            NT_int_setValue(N_n_0_22_state, 60)
        


            NT_int_setValue(N_n_0_23_state, 62)
        

            NT_int_setValue(N_n_0_24_state, 63)
        

            NT_int_setValue(N_n_0_25_state, 67)
        

            NT_int_setValue(N_n_0_26_state, 68)
        


            NT_int_setValue(N_n_0_33_state, 1)
        




            NT_int_setValue(N_n_0_1_state, 2)
        

            NT_int_setValue(N_n_0_2_state, 3)
        

            NT_int_setValue(N_n_0_3_state, 5)
        



            NT_int_setValue(N_n_0_4_state, 1)
        

            NT_int_setValue(N_n_0_5_state, 2)
        

            NT_int_setValue(N_n_0_6_state, 3)
        

            NT_int_setValue(N_n_0_20_state, 4)
        



            NT_int_setValue(N_n_0_7_state, 1)
        

            NT_int_setValue(N_n_0_8_state, 2)
        

            NT_int_setValue(N_n_0_9_state, 3)
        

            NT_int_setValue(N_n_0_11_state, 4)
        

            NT_int_setValue(N_n_0_10_state, 5)
        



            NT_int_setValue(N_n_0_19_state, 2)
        

            NT_int_setValue(N_n_0_13_state, 3)
        

            NT_int_setValue(N_n_0_14_state, 4)
        

            NT_int_setValue(N_n_0_12_state, 5)
        



            NT_int_setValue(N_n_0_15_state, 1)
        

            NT_int_setValue(N_n_0_17_state, 3)
        

            NT_int_setValue(N_n_0_18_state, 4)
        

            NT_int_setValue(N_n_0_16_state, 5)
        




            NT_int_setValue(N_n_0_40_state, 0)
        




            NT_int_setValue(N_n_0_44_state, 0)
        


            NT_int_setValue(N_n_0_55_state, 60)
        


            NT_int_setValue(N_n_0_56_state, 62)
        

            NT_int_setValue(N_n_0_57_state, 63)
        

            NT_int_setValue(N_n_0_58_state, 67)
        

            NT_int_setValue(N_n_0_59_state, 68)
        



            NT_int_setValue(N_n_0_46_state, 2)
        

            NT_add_setLeft(N_n_0_48_state, 0)
            NT_add_setRight(N_n_0_48_state, 0)
        



            NT_int_setValue(N_n_0_51_state, 0)
        


            NT_int_setValue(N_n_0_62_state, 60)
        


            NT_int_setValue(N_n_0_63_state, 62)
        

            NT_int_setValue(N_n_0_64_state, 63)
        

            NT_int_setValue(N_n_0_65_state, 67)
        

            NT_int_setValue(N_n_0_66_state, 68)
        

            NT_int_setValue(N_n_0_47_state, 4)
        

            NT_int_setValue(N_n_0_49_state, 0)
        

            NT_add_setLeft(N_n_0_50_state, 0)
            NT_add_setRight(N_n_0_50_state, 2)
        

            NT_add_setLeft(N_n_0_52_state, 0)
            NT_add_setRight(N_n_0_52_state, 4)
        

                N_n_0_70_state.messageSender = N_n_ioSnd_n_0_70_0_rcvs_0
                N_n_0_70_state.messageReceiver = function (m) {
                    NT_tgl_receiveMessage(N_n_0_70_state, m)
                }
                NT_tgl_setReceiveBusName(N_n_0_70_state, "empty")
    
                
            


            G_msgBuses_subscribe("note1", N_n_0_71_snds_0)
        


            NT_int_setValue(N_n_1_16_state, 0)
        

            NT_add_setLeft(N_n_1_19_state, 0)
            NT_add_setRight(N_n_1_19_state, 1)
        

            NT_modlegacy_setLeft(N_n_1_20_state, 0)
            NT_modlegacy_setRight(N_n_1_20_state, 3)
        








            NT_add_setLeft(N_n_1_13_state, 0)
            NT_add_setRight(N_n_1_13_state, 65)
        




            NT_div_setLeft(N_n_1_11_state, 0)
            NT_div_setRight(N_n_1_11_state, 127)
        




        N_n_1_8_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_1_8_state, 10)
    







            NT_add_setLeft(N_n_1_37_state, 0)
            NT_add_setRight(N_n_1_37_state, 65)
        




            NT_div_setLeft(N_n_1_35_state, 0)
            NT_div_setRight(N_n_1_35_state, 127)
        




        N_n_1_32_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_1_32_state, 10)
    







            NT_add_setLeft(N_n_1_53_state, 0)
            NT_add_setRight(N_n_1_53_state, 65)
        




            NT_div_setLeft(N_n_1_51_state, 0)
            NT_div_setRight(N_n_1_51_state, 127)
        




        N_n_1_48_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_1_48_state, 10)
    



            NT_add_setLeft(N_n_1_22_state, 0)
            NT_add_setRight(N_n_1_22_state, 111)
        


            G_msgBuses_subscribe("note2", N_n_0_73_snds_0)
        


            NT_int_setValue(N_n_2_16_state, 0)
        

            NT_add_setLeft(N_n_2_19_state, 0)
            NT_add_setRight(N_n_2_19_state, 1)
        

            NT_modlegacy_setLeft(N_n_2_20_state, 0)
            NT_modlegacy_setRight(N_n_2_20_state, 3)
        








            NT_add_setLeft(N_n_2_13_state, 0)
            NT_add_setRight(N_n_2_13_state, 65)
        




            NT_div_setLeft(N_n_2_11_state, 0)
            NT_div_setRight(N_n_2_11_state, 127)
        




        N_n_2_8_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_2_8_state, 10)
    







            NT_add_setLeft(N_n_2_37_state, 0)
            NT_add_setRight(N_n_2_37_state, 65)
        




            NT_div_setLeft(N_n_2_35_state, 0)
            NT_div_setRight(N_n_2_35_state, 127)
        




        N_n_2_32_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_2_32_state, 10)
    







            NT_add_setLeft(N_n_2_53_state, 0)
            NT_add_setRight(N_n_2_53_state, 65)
        




            NT_div_setLeft(N_n_2_51_state, 0)
            NT_div_setRight(N_n_2_51_state, 127)
        




        N_n_2_48_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_2_48_state, 10)
    



            NT_add_setLeft(N_n_2_22_state, 0)
            NT_add_setRight(N_n_2_22_state, 111)
        


            G_msgBuses_subscribe("note3", N_n_0_78_snds_0)
        


            NT_int_setValue(N_n_3_16_state, 0)
        

            NT_add_setLeft(N_n_3_19_state, 0)
            NT_add_setRight(N_n_3_19_state, 1)
        

            NT_modlegacy_setLeft(N_n_3_20_state, 0)
            NT_modlegacy_setRight(N_n_3_20_state, 3)
        








            NT_add_setLeft(N_n_3_13_state, 0)
            NT_add_setRight(N_n_3_13_state, 65)
        




            NT_div_setLeft(N_n_3_11_state, 0)
            NT_div_setRight(N_n_3_11_state, 127)
        




        N_n_3_8_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_3_8_state, 10)
    







            NT_add_setLeft(N_n_3_37_state, 0)
            NT_add_setRight(N_n_3_37_state, 65)
        




            NT_div_setLeft(N_n_3_35_state, 0)
            NT_div_setRight(N_n_3_35_state, 127)
        




        N_n_3_32_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_3_32_state, 10)
    







            NT_add_setLeft(N_n_3_53_state, 0)
            NT_add_setRight(N_n_3_53_state, 65)
        




            NT_div_setLeft(N_n_3_51_state, 0)
            NT_div_setRight(N_n_3_51_state, 127)
        




        N_n_3_48_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_3_48_state, 10)
    



            NT_add_setLeft(N_n_3_22_state, 0)
            NT_add_setRight(N_n_3_22_state, 111)
        


            NT_int_setValue(N_n_0_91_state, 63)
        


            NT_line_setGrain(N_n_0_111_state, 20)
            N_n_0_111_state.snd0 = N_n_0_85_rcvs_0
            N_n_0_111_state.tickCallback = function () {
                NT_line_tick(N_n_0_111_state)
            }
        

            NT_sub_setLeft(N_n_0_85_state, 0)
            NT_sub_setRight(N_n_0_85_state, 12)
        


            NT_add_setLeft(N_n_0_84_state, 0)
            NT_add_setRight(N_n_0_84_state, 0.5)
        





            NT_int_setValue(N_n_0_93_state, 1)
        

            NT_osc_t_setStep(N_n_0_88_state, 0)
        

            NT_osc_t_setStep(N_n_0_89_state, 0)
        

            G_msgBuses_subscribe("note4", N_n_0_96_snds_0)
        



            G_msgBuses_subscribe("start", N_n_0_99_snds_0)
        





            N_n_0_114_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        

            NT_int_setValue(N_n_0_116_state, 0)
        



        N_n_0_100_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_100_state, m)
        }
        N_n_0_100_state.messageSender = N_n_ioSnd_n_0_100_0_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_100_state, "empty")

        
    


        N_n_0_101_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_101_state, m)
        }
        N_n_0_101_state.messageSender = N_n_ioSnd_n_0_101_0_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_101_state, "empty")

        
    


        N_n_0_102_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_102_state, m)
        }
        N_n_0_102_state.messageSender = N_n_ioSnd_n_0_102_0_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_102_state, "empty")

        
    


        N_n_0_103_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_103_state, m)
        }
        N_n_0_103_state.messageSender = N_n_ioSnd_n_0_103_0_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_103_state, "empty")

        
    


        N_n_0_104_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_104_state, m)
        }
        N_n_0_104_state.messageSender = N_n_ioSnd_n_0_104_0_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_104_state, "empty")

        
    


        N_n_0_105_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_105_state, m)
        }
        N_n_0_105_state.messageSender = N_n_ioSnd_n_0_105_0_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_105_state, "empty")

        
    


        N_n_0_106_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_0_106_state, m)
        }
        N_n_0_106_state.messageSender = N_n_ioSnd_n_0_106_0_rcvs_0
        NT_bang_setReceiveBusName(N_n_0_106_state, "empty")

        
    


            G_msgBuses_subscribe("start", N_n_0_109_snds_0)
        

            N_n_0_69_state.snd0 = N_n_0_34_rcvs_0
            N_n_0_69_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
            NT_metro_setRate(N_n_0_69_state, 2000)
            N_n_0_69_state.tickCallback = function () {
                NT_metro_scheduleNextTick(N_n_0_69_state)
            }
        

G_commons_waitFrame(0, () => N_n_0_113_snds_0(G_bangUtils_bang()))
G_commons_waitFrame(0, () => N_n_4_35_snds_0(G_bangUtils_bang()))

            NT_float_setValue(N_n_4_65_state, 100)
        


            NT_mul_setLeft(N_n_4_64_state, 0)
            NT_mul_setRight(N_n_4_64_state, 0.125)
        



            NT_float_setValue(N_n_4_66_state, 90)
        


            NT_div_setLeft(N_n_4_32_state, 0)
            NT_div_setRight(N_n_4_32_state, 200)
        



            NT_float_setValue(N_n_4_67_state, 3000)
        


            N_n_4_41_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_4_41_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_4_41_state.msgSpecs[0].outTemplate = []

                N_n_4_41_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_4_41_state.msgSpecs[0].outMessage = G_msg_create(N_n_4_41_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_4_41_state.msgSpecs[0].outMessage, 0, 3000)
            
        

            NT_float_setValue(N_n_4_44_state, 0)
        









            NT_float_setValue(N_n_4_68_state, 20)
        


            NT_float_setValue(N_n_4_45_state, 0)
        

            NT_mul_setLeft(N_n_4_46_state, 0)
            NT_mul_setRight(N_n_4_46_state, 0.01)
        



            G_msgBuses_subscribe("giaale", N_n_6_1_rcvs_0)
        

            N_n_6_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_1_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_1_state.msgSpecs[2].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_1_state.msgSpecs[3].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_1_state.msgSpecs[4].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_6_1_state.msgSpecs[0].outTemplate = []

                N_n_6_1_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_6_1_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_6_1_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_1_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_6_1_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_6_1_state.msgSpecs[0].outMessage, 0, "list")
            

                G_msg_writeFloatToken(N_n_6_1_state.msgSpecs[0].outMessage, 1, 1)
            

                G_msg_writeFloatToken(N_n_6_1_state.msgSpecs[0].outMessage, 2, 60)
            

        
        
        
    
N_n_6_1_state.msgSpecs[1].outTemplate = []

                N_n_6_1_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_1_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_1_state.msgSpecs[1].outMessage = G_msg_create(N_n_6_1_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_6_1_state.msgSpecs[1].outMessage, 0, 2)
            

                G_msg_writeFloatToken(N_n_6_1_state.msgSpecs[1].outMessage, 1, 62)
            

        
        
        
    
N_n_6_1_state.msgSpecs[2].outTemplate = []

                N_n_6_1_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_1_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_1_state.msgSpecs[2].outMessage = G_msg_create(N_n_6_1_state.msgSpecs[2].outTemplate)

                G_msg_writeFloatToken(N_n_6_1_state.msgSpecs[2].outMessage, 0, 3)
            

                G_msg_writeFloatToken(N_n_6_1_state.msgSpecs[2].outMessage, 1, 63)
            

        
        
        
    
N_n_6_1_state.msgSpecs[3].outTemplate = []

                N_n_6_1_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_1_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_1_state.msgSpecs[3].outMessage = G_msg_create(N_n_6_1_state.msgSpecs[3].outTemplate)

                G_msg_writeFloatToken(N_n_6_1_state.msgSpecs[3].outMessage, 0, 4)
            

                G_msg_writeFloatToken(N_n_6_1_state.msgSpecs[3].outMessage, 1, 67)
            

        
        
        
    
N_n_6_1_state.msgSpecs[4].outTemplate = []

                N_n_6_1_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_1_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_1_state.msgSpecs[4].outMessage = G_msg_create(N_n_6_1_state.msgSpecs[4].outTemplate)

                G_msg_writeFloatToken(N_n_6_1_state.msgSpecs[4].outMessage, 0, 5)
            

                G_msg_writeFloatToken(N_n_6_1_state.msgSpecs[4].outMessage, 1, 68)
            
        

        

        
    



            G_msgBuses_subscribe("mera", N_n_6_2_rcvs_0)
        

            N_n_6_2_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_2_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_2_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_2_state.msgSpecs[2].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_2_state.msgSpecs[3].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_2_state.msgSpecs[4].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_6_2_state.msgSpecs[0].outTemplate = []

                N_n_6_2_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_6_2_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_6_2_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_2_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_2_state.msgSpecs[0].outMessage = G_msg_create(N_n_6_2_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_6_2_state.msgSpecs[0].outMessage, 0, "list")
            

                G_msg_writeFloatToken(N_n_6_2_state.msgSpecs[0].outMessage, 1, 1)
            

                G_msg_writeFloatToken(N_n_6_2_state.msgSpecs[0].outMessage, 2, 60)
            

        
        
        
    
N_n_6_2_state.msgSpecs[1].outTemplate = []

                N_n_6_2_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_2_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_2_state.msgSpecs[1].outMessage = G_msg_create(N_n_6_2_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_6_2_state.msgSpecs[1].outMessage, 0, 2)
            

                G_msg_writeFloatToken(N_n_6_2_state.msgSpecs[1].outMessage, 1, 62)
            

        
        
        
    
N_n_6_2_state.msgSpecs[2].outTemplate = []

                N_n_6_2_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_2_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_2_state.msgSpecs[2].outMessage = G_msg_create(N_n_6_2_state.msgSpecs[2].outTemplate)

                G_msg_writeFloatToken(N_n_6_2_state.msgSpecs[2].outMessage, 0, 3)
            

                G_msg_writeFloatToken(N_n_6_2_state.msgSpecs[2].outMessage, 1, 64)
            

        
        
        
    
N_n_6_2_state.msgSpecs[3].outTemplate = []

                N_n_6_2_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_2_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_2_state.msgSpecs[3].outMessage = G_msg_create(N_n_6_2_state.msgSpecs[3].outTemplate)

                G_msg_writeFloatToken(N_n_6_2_state.msgSpecs[3].outMessage, 0, 4)
            

                G_msg_writeFloatToken(N_n_6_2_state.msgSpecs[3].outMessage, 1, 67)
            

        
        
        
    
N_n_6_2_state.msgSpecs[4].outTemplate = []

                N_n_6_2_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_2_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_2_state.msgSpecs[4].outMessage = G_msg_create(N_n_6_2_state.msgSpecs[4].outTemplate)

                G_msg_writeFloatToken(N_n_6_2_state.msgSpecs[4].outMessage, 0, 5)
            

                G_msg_writeFloatToken(N_n_6_2_state.msgSpecs[4].outMessage, 1, 69)
            
        

            G_msgBuses_subscribe("poan", N_n_6_3_rcvs_0)
        

            N_n_6_3_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_3_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_3_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_3_state.msgSpecs[2].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_3_state.msgSpecs[3].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_3_state.msgSpecs[4].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_6_3_state.msgSpecs[0].outTemplate = []

                N_n_6_3_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_6_3_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_6_3_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_3_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_3_state.msgSpecs[0].outMessage = G_msg_create(N_n_6_3_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_6_3_state.msgSpecs[0].outMessage, 0, "list")
            

                G_msg_writeFloatToken(N_n_6_3_state.msgSpecs[0].outMessage, 1, 1)
            

                G_msg_writeFloatToken(N_n_6_3_state.msgSpecs[0].outMessage, 2, 60)
            

        
        
        
    
N_n_6_3_state.msgSpecs[1].outTemplate = []

                N_n_6_3_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_3_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_3_state.msgSpecs[1].outMessage = G_msg_create(N_n_6_3_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_6_3_state.msgSpecs[1].outMessage, 0, 2)
            

                G_msg_writeFloatToken(N_n_6_3_state.msgSpecs[1].outMessage, 1, 62)
            

        
        
        
    
N_n_6_3_state.msgSpecs[2].outTemplate = []

                N_n_6_3_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_3_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_3_state.msgSpecs[2].outMessage = G_msg_create(N_n_6_3_state.msgSpecs[2].outTemplate)

                G_msg_writeFloatToken(N_n_6_3_state.msgSpecs[2].outMessage, 0, 3)
            

                G_msg_writeFloatToken(N_n_6_3_state.msgSpecs[2].outMessage, 1, 64)
            

        
        
        
    
N_n_6_3_state.msgSpecs[3].outTemplate = []

                N_n_6_3_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_3_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_3_state.msgSpecs[3].outMessage = G_msg_create(N_n_6_3_state.msgSpecs[3].outTemplate)

                G_msg_writeFloatToken(N_n_6_3_state.msgSpecs[3].outMessage, 0, 4)
            

                G_msg_writeFloatToken(N_n_6_3_state.msgSpecs[3].outMessage, 1, 66)
            

        
        
        
    
N_n_6_3_state.msgSpecs[4].outTemplate = []

                N_n_6_3_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_3_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_3_state.msgSpecs[4].outMessage = G_msg_create(N_n_6_3_state.msgSpecs[4].outTemplate)

                G_msg_writeFloatToken(N_n_6_3_state.msgSpecs[4].outMessage, 0, 5)
            

                G_msg_writeFloatToken(N_n_6_3_state.msgSpecs[4].outMessage, 1, 68)
            
        

            G_msgBuses_subscribe("maisia", N_n_6_4_rcvs_0)
        

            N_n_6_4_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_4_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_4_state.msgSpecs[2].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_4_state.msgSpecs[3].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_4_state.msgSpecs[4].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_6_4_state.msgSpecs[0].outTemplate = []

                N_n_6_4_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_6_4_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_6_4_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_4_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_4_state.msgSpecs[0].outMessage = G_msg_create(N_n_6_4_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_6_4_state.msgSpecs[0].outMessage, 0, "list")
            

                G_msg_writeFloatToken(N_n_6_4_state.msgSpecs[0].outMessage, 1, 1)
            

                G_msg_writeFloatToken(N_n_6_4_state.msgSpecs[0].outMessage, 2, 60)
            

        
        
        
    
N_n_6_4_state.msgSpecs[1].outTemplate = []

                N_n_6_4_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_4_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_4_state.msgSpecs[1].outMessage = G_msg_create(N_n_6_4_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_6_4_state.msgSpecs[1].outMessage, 0, 2)
            

                G_msg_writeFloatToken(N_n_6_4_state.msgSpecs[1].outMessage, 1, 62)
            

        
        
        
    
N_n_6_4_state.msgSpecs[2].outTemplate = []

                N_n_6_4_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_4_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_4_state.msgSpecs[2].outMessage = G_msg_create(N_n_6_4_state.msgSpecs[2].outTemplate)

                G_msg_writeFloatToken(N_n_6_4_state.msgSpecs[2].outMessage, 0, 3)
            

                G_msg_writeFloatToken(N_n_6_4_state.msgSpecs[2].outMessage, 1, 65)
            

        
        
        
    
N_n_6_4_state.msgSpecs[3].outTemplate = []

                N_n_6_4_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_4_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_4_state.msgSpecs[3].outMessage = G_msg_create(N_n_6_4_state.msgSpecs[3].outTemplate)

                G_msg_writeFloatToken(N_n_6_4_state.msgSpecs[3].outMessage, 0, 4)
            

                G_msg_writeFloatToken(N_n_6_4_state.msgSpecs[3].outMessage, 1, 68)
            

        
        
        
    
N_n_6_4_state.msgSpecs[4].outTemplate = []

                N_n_6_4_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_4_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_4_state.msgSpecs[4].outMessage = G_msg_create(N_n_6_4_state.msgSpecs[4].outTemplate)

                G_msg_writeFloatToken(N_n_6_4_state.msgSpecs[4].outMessage, 0, 5)
            

                G_msg_writeFloatToken(N_n_6_4_state.msgSpecs[4].outMessage, 1, 72)
            
        

            G_msgBuses_subscribe("bagat", N_n_6_5_rcvs_0)
        

            N_n_6_5_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_5_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_5_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_5_state.msgSpecs[2].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_5_state.msgSpecs[3].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_5_state.msgSpecs[4].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_6_5_state.msgSpecs[0].outTemplate = []

                N_n_6_5_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_6_5_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_6_5_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_5_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_5_state.msgSpecs[0].outMessage = G_msg_create(N_n_6_5_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_6_5_state.msgSpecs[0].outMessage, 0, "list")
            

                G_msg_writeFloatToken(N_n_6_5_state.msgSpecs[0].outMessage, 1, 1)
            

                G_msg_writeFloatToken(N_n_6_5_state.msgSpecs[0].outMessage, 2, 60)
            

        
        
        
    
N_n_6_5_state.msgSpecs[1].outTemplate = []

                N_n_6_5_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_5_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_5_state.msgSpecs[1].outMessage = G_msg_create(N_n_6_5_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_6_5_state.msgSpecs[1].outMessage, 0, 2)
            

                G_msg_writeFloatToken(N_n_6_5_state.msgSpecs[1].outMessage, 1, 63)
            

        
        
        
    
N_n_6_5_state.msgSpecs[2].outTemplate = []

                N_n_6_5_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_5_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_5_state.msgSpecs[2].outMessage = G_msg_create(N_n_6_5_state.msgSpecs[2].outTemplate)

                G_msg_writeFloatToken(N_n_6_5_state.msgSpecs[2].outMessage, 0, 3)
            

                G_msg_writeFloatToken(N_n_6_5_state.msgSpecs[2].outMessage, 1, 66)
            

        
        
        
    
N_n_6_5_state.msgSpecs[3].outTemplate = []

                N_n_6_5_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_5_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_5_state.msgSpecs[3].outMessage = G_msg_create(N_n_6_5_state.msgSpecs[3].outTemplate)

                G_msg_writeFloatToken(N_n_6_5_state.msgSpecs[3].outMessage, 0, 4)
            

                G_msg_writeFloatToken(N_n_6_5_state.msgSpecs[3].outMessage, 1, 68)
            

        
        
        
    
N_n_6_5_state.msgSpecs[4].outTemplate = []

                N_n_6_5_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_5_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_5_state.msgSpecs[4].outMessage = G_msg_create(N_n_6_5_state.msgSpecs[4].outTemplate)

                G_msg_writeFloatToken(N_n_6_5_state.msgSpecs[4].outMessage, 0, 5)
            

                G_msg_writeFloatToken(N_n_6_5_state.msgSpecs[4].outMessage, 1, 72)
            
        

            G_msgBuses_subscribe("mazand", N_n_6_6_rcvs_0)
        

            N_n_6_6_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_6_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_6_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_6_state.msgSpecs[2].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_6_state.msgSpecs[3].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_6_state.msgSpecs[4].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_6_6_state.msgSpecs[0].outTemplate = []

                N_n_6_6_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_6_6_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_6_6_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_6_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_6_state.msgSpecs[0].outMessage = G_msg_create(N_n_6_6_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_6_6_state.msgSpecs[0].outMessage, 0, "list")
            

                G_msg_writeFloatToken(N_n_6_6_state.msgSpecs[0].outMessage, 1, 1)
            

                G_msg_writeFloatToken(N_n_6_6_state.msgSpecs[0].outMessage, 2, 60)
            

        
        
        
    
N_n_6_6_state.msgSpecs[1].outTemplate = []

                N_n_6_6_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_6_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_6_state.msgSpecs[1].outMessage = G_msg_create(N_n_6_6_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_6_6_state.msgSpecs[1].outMessage, 0, 2)
            

                G_msg_writeFloatToken(N_n_6_6_state.msgSpecs[1].outMessage, 1, 62)
            

        
        
        
    
N_n_6_6_state.msgSpecs[2].outTemplate = []

                N_n_6_6_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_6_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_6_state.msgSpecs[2].outMessage = G_msg_create(N_n_6_6_state.msgSpecs[2].outTemplate)

                G_msg_writeFloatToken(N_n_6_6_state.msgSpecs[2].outMessage, 0, 3)
            

                G_msg_writeFloatToken(N_n_6_6_state.msgSpecs[2].outMessage, 1, 65)
            

        
        
        
    
N_n_6_6_state.msgSpecs[3].outTemplate = []

                N_n_6_6_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_6_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_6_state.msgSpecs[3].outMessage = G_msg_create(N_n_6_6_state.msgSpecs[3].outTemplate)

                G_msg_writeFloatToken(N_n_6_6_state.msgSpecs[3].outMessage, 0, 4)
            

                G_msg_writeFloatToken(N_n_6_6_state.msgSpecs[3].outMessage, 1, 67)
            

        
        
        
    
N_n_6_6_state.msgSpecs[4].outTemplate = []

                N_n_6_6_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_6_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_6_state.msgSpecs[4].outMessage = G_msg_create(N_n_6_6_state.msgSpecs[4].outTemplate)

                G_msg_writeFloatToken(N_n_6_6_state.msgSpecs[4].outMessage, 0, 5)
            

                G_msg_writeFloatToken(N_n_6_6_state.msgSpecs[4].outMessage, 1, 68)
            
        

            G_msgBuses_subscribe("rastad", N_n_6_7_rcvs_0)
        

            N_n_6_7_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_7_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_7_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_7_state.msgSpecs[2].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_7_state.msgSpecs[3].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_6_7_state.msgSpecs[4].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_6_7_state.msgSpecs[0].outTemplate = []

                N_n_6_7_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_6_7_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_6_7_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_7_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_7_state.msgSpecs[0].outMessage = G_msg_create(N_n_6_7_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_6_7_state.msgSpecs[0].outMessage, 0, "list")
            

                G_msg_writeFloatToken(N_n_6_7_state.msgSpecs[0].outMessage, 1, 1)
            

                G_msg_writeFloatToken(N_n_6_7_state.msgSpecs[0].outMessage, 2, 60)
            

        
        
        
    
N_n_6_7_state.msgSpecs[1].outTemplate = []

                N_n_6_7_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_7_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_7_state.msgSpecs[1].outMessage = G_msg_create(N_n_6_7_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_6_7_state.msgSpecs[1].outMessage, 0, 2)
            

                G_msg_writeFloatToken(N_n_6_7_state.msgSpecs[1].outMessage, 1, 63)
            

        
        
        
    
N_n_6_7_state.msgSpecs[2].outTemplate = []

                N_n_6_7_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_7_state.msgSpecs[2].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_7_state.msgSpecs[2].outMessage = G_msg_create(N_n_6_7_state.msgSpecs[2].outTemplate)

                G_msg_writeFloatToken(N_n_6_7_state.msgSpecs[2].outMessage, 0, 3)
            

                G_msg_writeFloatToken(N_n_6_7_state.msgSpecs[2].outMessage, 1, 65)
            

        
        
        
    
N_n_6_7_state.msgSpecs[3].outTemplate = []

                N_n_6_7_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_7_state.msgSpecs[3].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_7_state.msgSpecs[3].outMessage = G_msg_create(N_n_6_7_state.msgSpecs[3].outTemplate)

                G_msg_writeFloatToken(N_n_6_7_state.msgSpecs[3].outMessage, 0, 4)
            

                G_msg_writeFloatToken(N_n_6_7_state.msgSpecs[3].outMessage, 1, 67)
            

        
        
        
    
N_n_6_7_state.msgSpecs[4].outTemplate = []

                N_n_6_7_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_6_7_state.msgSpecs[4].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_6_7_state.msgSpecs[4].outMessage = G_msg_create(N_n_6_7_state.msgSpecs[4].outTemplate)

                G_msg_writeFloatToken(N_n_6_7_state.msgSpecs[4].outMessage, 0, 5)
            

                G_msg_writeFloatToken(N_n_6_7_state.msgSpecs[4].outMessage, 1, 68)
            
        
G_commons_waitFrame(0, () => N_n_6_19_rcvs_0(G_bangUtils_bang()))

        N_n_6_19_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
        NT_delay_setDelay(N_n_6_19_state, 1000)
    



            G_msgBuses_subscribe("SEED", N_n_7_2_rcvs_0)
        


            NT_add_setLeft(N_n_7_4_state, 0)
            NT_add_setRight(N_n_7_4_state, 0)
        

            N_n_7_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_7_1_state.msgSpecs[0].outTemplate = []

                N_n_7_1_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_7_1_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_7_1_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_7_1_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            
N_n_7_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_7_1_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_7_1_state.msgSpecs[0].outMessage, 0, "seed")
            

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_7_1_state.msgSpecs[0].outMessage, 1, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_7_1_state.msgSpecs[0].outMessage, 1, stringMem[0])
                }
            
                            return N_n_7_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        


            G_msgBuses_subscribe("SEED", N_n_8_2_rcvs_0)
        


            NT_add_setLeft(N_n_8_4_state, 0)
            NT_add_setRight(N_n_8_4_state, 0)
        

            N_n_8_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_8_1_state.msgSpecs[0].outTemplate = []

                N_n_8_1_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_8_1_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_8_1_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_8_1_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            
N_n_8_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_8_1_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_8_1_state.msgSpecs[0].outMessage, 0, "seed")
            

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_8_1_state.msgSpecs[0].outMessage, 1, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_8_1_state.msgSpecs[0].outMessage, 1, stringMem[0])
                }
            
                            return N_n_8_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        


            G_msgBuses_subscribe("SEED", N_n_9_2_rcvs_0)
        


            NT_add_setLeft(N_n_9_4_state, 0)
            NT_add_setRight(N_n_9_4_state, 0)
        

            N_n_9_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_9_1_state.msgSpecs[0].outTemplate = []

                N_n_9_1_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_9_1_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_9_1_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_9_1_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            
N_n_9_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_9_1_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_9_1_state.msgSpecs[0].outMessage, 0, "seed")
            

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_9_1_state.msgSpecs[0].outMessage, 1, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_9_1_state.msgSpecs[0].outMessage, 1, stringMem[0])
                }
            
                            return N_n_9_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        


            G_msgBuses_subscribe("SEED", N_n_10_2_rcvs_0)
        


            NT_add_setLeft(N_n_10_4_state, 0)
            NT_add_setRight(N_n_10_4_state, 0)
        

            N_n_10_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_10_1_state.msgSpecs[0].outTemplate = []

                N_n_10_1_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_10_1_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_10_1_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_10_1_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            
N_n_10_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_10_1_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_10_1_state.msgSpecs[0].outMessage, 0, "seed")
            

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_10_1_state.msgSpecs[0].outMessage, 1, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_10_1_state.msgSpecs[0].outMessage, 1, stringMem[0])
                }
            
                            return N_n_10_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        


            G_msgBuses_subscribe("SEED", N_n_11_2_rcvs_0)
        


            NT_add_setLeft(N_n_11_4_state, 0)
            NT_add_setRight(N_n_11_4_state, 0)
        

            N_n_11_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_11_1_state.msgSpecs[0].outTemplate = []

                N_n_11_1_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_11_1_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_11_1_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_11_1_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            
N_n_11_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_11_1_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_11_1_state.msgSpecs[0].outMessage, 0, "seed")
            

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_11_1_state.msgSpecs[0].outMessage, 1, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_11_1_state.msgSpecs[0].outMessage, 1, stringMem[0])
                }
            
                            return N_n_11_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        


            G_msgBuses_subscribe("SEED", N_n_12_2_rcvs_0)
        


            NT_add_setLeft(N_n_12_4_state, 0)
            NT_add_setRight(N_n_12_4_state, 0)
        

            N_n_12_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_12_1_state.msgSpecs[0].outTemplate = []

                N_n_12_1_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_12_1_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_12_1_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_12_1_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            
N_n_12_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_12_1_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_12_1_state.msgSpecs[0].outMessage, 0, "seed")
            

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_12_1_state.msgSpecs[0].outMessage, 1, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_12_1_state.msgSpecs[0].outMessage, 1, stringMem[0])
                }
            
                            return N_n_12_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        


            G_msgBuses_subscribe("SEED", N_n_13_2_rcvs_0)
        


            NT_add_setLeft(N_n_13_4_state, 0)
            NT_add_setRight(N_n_13_4_state, 0)
        

            N_n_13_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_13_1_state.msgSpecs[0].outTemplate = []

                N_n_13_1_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_13_1_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_13_1_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_13_1_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            
N_n_13_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_13_1_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_13_1_state.msgSpecs[0].outMessage, 0, "seed")
            

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_13_1_state.msgSpecs[0].outMessage, 1, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_13_1_state.msgSpecs[0].outMessage, 1, stringMem[0])
                }
            
                            return N_n_13_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        


            G_msgBuses_subscribe("SEED", N_n_14_2_rcvs_0)
        


            NT_add_setLeft(N_n_14_4_state, 0)
            NT_add_setRight(N_n_14_4_state, 0)
        

            N_n_14_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
        
        
        let stringMem = []
    
N_n_14_1_state.msgSpecs[0].outTemplate = []

                N_n_14_1_state.msgSpecs[0].outTemplate.push(G_msg_STRING_TOKEN)
                N_n_14_1_state.msgSpecs[0].outTemplate.push(4)
            

                N_n_14_1_state.msgSpecs[0].outTemplate.push(G_msg_getTokenType(inMessage, 0))
                if (G_msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = G_msg_readStringToken(inMessage, 0)
                    N_n_14_1_state.msgSpecs[0].outTemplate.push(stringMem[0].length)
                }
            
N_n_14_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_14_1_state.msgSpecs[0].outTemplate)

                G_msg_writeStringToken(N_n_14_1_state.msgSpecs[0].outMessage, 0, "seed")
            

                if (G_msg_isFloatToken(inMessage, 0)) {
                    G_msg_writeFloatToken(N_n_14_1_state.msgSpecs[0].outMessage, 1, G_msg_readFloatToken(inMessage, 0))
                } else if (G_msg_isStringToken(inMessage, 0)) {
                    G_msg_writeStringToken(N_n_14_1_state.msgSpecs[0].outMessage, 1, stringMem[0])
                }
            
                            return N_n_14_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        















            NT_osc_t_setStep(N_n_1_2_state, 0)
        




            NT_osc_t_setStep(N_n_1_4_state, 0)
        




            NT_osc_t_setStep(N_n_1_26_state, 0)
        




            NT_osc_t_setStep(N_n_1_28_state, 0)
        




            NT_osc_t_setStep(N_n_1_42_state, 0)
        




            NT_osc_t_setStep(N_n_1_44_state, 0)
        






            NT_osc_t_setStep(N_n_2_2_state, 0)
        




            NT_osc_t_setStep(N_n_2_4_state, 0)
        




            NT_osc_t_setStep(N_n_2_26_state, 0)
        




            NT_osc_t_setStep(N_n_2_28_state, 0)
        




            NT_osc_t_setStep(N_n_2_42_state, 0)
        




            NT_osc_t_setStep(N_n_2_44_state, 0)
        






            NT_osc_t_setStep(N_n_3_2_state, 0)
        




            NT_osc_t_setStep(N_n_3_4_state, 0)
        




            NT_osc_t_setStep(N_n_3_26_state, 0)
        




            NT_osc_t_setStep(N_n_3_28_state, 0)
        




            NT_osc_t_setStep(N_n_3_42_state, 0)
        




            NT_osc_t_setStep(N_n_3_44_state, 0)
        








        NT_receive_t_setBusName(N_n_0_98_state, "drone")
    







        N_n_5_14_state.setDelayNameCallback = function (_) {
            N_n_5_14_state.buffer = G_delayBuffers__BUFFERS.get(N_n_5_14_state.delayName)
            NT_delread_t_updateOffset(N_n_5_14_state)
        }

        if ("0-ref1".length) {
            NT_delread_t_setDelayName(N_n_5_14_state, "0-ref1", N_n_5_14_state.setDelayNameCallback)
        }
    



        N_n_5_16_state.setDelayNameCallback = function (_) {
            N_n_5_16_state.buffer = G_delayBuffers__BUFFERS.get(N_n_5_16_state.delayName)
            NT_delread_t_updateOffset(N_n_5_16_state)
        }

        if ("0-ref2".length) {
            NT_delread_t_setDelayName(N_n_5_16_state, "0-ref2", N_n_5_16_state.setDelayNameCallback)
        }
    



        N_n_5_18_state.setDelayNameCallback = function (_) {
            N_n_5_18_state.buffer = G_delayBuffers__BUFFERS.get(N_n_5_18_state.delayName)
            NT_delread_t_updateOffset(N_n_5_18_state)
        }

        if ("0-ref3".length) {
            NT_delread_t_setDelayName(N_n_5_18_state, "0-ref3", N_n_5_18_state.setDelayNameCallback)
        }
    



        N_n_5_20_state.setDelayNameCallback = function (_) {
            N_n_5_20_state.buffer = G_delayBuffers__BUFFERS.get(N_n_5_20_state.delayName)
            NT_delread_t_updateOffset(N_n_5_20_state)
        }

        if ("0-ref4".length) {
            NT_delread_t_setDelayName(N_n_5_20_state, "0-ref4", N_n_5_20_state.setDelayNameCallback)
        }
    



        N_n_5_24_state.setDelayNameCallback = function (_) {
            N_n_5_24_state.buffer = G_delayBuffers__BUFFERS.get(N_n_5_24_state.delayName)
            NT_delread_t_updateOffset(N_n_5_24_state)
        }

        if ("0-ref5".length) {
            NT_delread_t_setDelayName(N_n_5_24_state, "0-ref5", N_n_5_24_state.setDelayNameCallback)
        }
    



        N_n_4_16_state.setDelayNameCallback = function (_) {
            N_n_4_16_state.buffer = G_delayBuffers__BUFFERS.get(N_n_4_16_state.delayName)
            NT_delread_t_updateOffset(N_n_4_16_state)
        }

        if ("0-del1".length) {
            NT_delread_t_setDelayName(N_n_4_16_state, "0-del1", N_n_4_16_state.setDelayNameCallback)
        }
    










        N_n_5_22_state.setDelayNameCallback = function (_) {
            N_n_5_22_state.buffer = G_delayBuffers__BUFFERS.get(N_n_5_22_state.delayName)
            NT_delread_t_updateOffset(N_n_5_22_state)
        }

        if ("0-ref6".length) {
            NT_delread_t_setDelayName(N_n_5_22_state, "0-ref6", N_n_5_22_state.setDelayNameCallback)
        }
    


        N_n_4_17_state.setDelayNameCallback = function (_) {
            N_n_4_17_state.buffer = G_delayBuffers__BUFFERS.get(N_n_4_17_state.delayName)
            NT_delread_t_updateOffset(N_n_4_17_state)
        }

        if ("0-del2".length) {
            NT_delread_t_setDelayName(N_n_4_17_state, "0-del2", N_n_4_17_state.setDelayNameCallback)
        }
    












        NT_send_t_setBusName(N_n_0_97_state, "drone")
    



        N_n_4_18_state.setDelayNameCallback = function (_) {
            N_n_4_18_state.buffer = G_delayBuffers__BUFFERS.get(N_n_4_18_state.delayName)
            NT_delread_t_updateOffset(N_n_4_18_state)
        }

        if ("0-del3".length) {
            NT_delread_t_setDelayName(N_n_4_18_state, "0-del3", N_n_4_18_state.setDelayNameCallback)
        }
    







        N_n_4_19_state.setDelayNameCallback = function (_) {
            N_n_4_19_state.buffer = G_delayBuffers__BUFFERS.get(N_n_4_19_state.delayName)
            NT_delread_t_updateOffset(N_n_4_19_state)
        }

        if ("0-del4".length) {
            NT_delread_t_setDelayName(N_n_4_19_state, "0-del4", N_n_4_19_state.setDelayNameCallback)
        }
    








        N_n_4_22_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                58.6435,
                "msec"
            )))
        )
        if ("0-del1".length) {
            NT_delwrite_t_setDelayName(N_n_4_22_state, "0-del1")
        }
    




        N_n_4_23_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                69.4325,
                "msec"
            )))
        )
        if ("0-del2".length) {
            NT_delwrite_t_setDelayName(N_n_4_23_state, "0-del2")
        }
    


        N_n_4_24_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                74.5234,
                "msec"
            )))
        )
        if ("0-del3".length) {
            NT_delwrite_t_setDelayName(N_n_4_24_state, "0-del3")
        }
    


        N_n_4_25_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                86.1244,
                "msec"
            )))
        )
        if ("0-del4".length) {
            NT_delwrite_t_setDelayName(N_n_4_25_state, "0-del4")
        }
    

        N_n_5_13_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                43.5337,
                "msec"
            )))
        )
        if ("0-ref1".length) {
            NT_delwrite_t_setDelayName(N_n_5_13_state, "0-ref1")
        }
    


        N_n_5_15_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                25.796,
                "msec"
            )))
        )
        if ("0-ref2".length) {
            NT_delwrite_t_setDelayName(N_n_5_15_state, "0-ref2")
        }
    


        N_n_5_17_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                19.392,
                "msec"
            )))
        )
        if ("0-ref3".length) {
            NT_delwrite_t_setDelayName(N_n_5_17_state, "0-ref3")
        }
    


        N_n_5_19_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                16.364,
                "msec"
            )))
        )
        if ("0-ref4".length) {
            NT_delwrite_t_setDelayName(N_n_5_19_state, "0-ref4")
        }
    


        N_n_5_21_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                4.2546,
                "msec"
            )))
        )
        if ("0-ref6".length) {
            NT_delwrite_t_setDelayName(N_n_5_21_state, "0-ref6")
        }
    


        N_n_5_23_state.buffer = G_buf_create(
            toInt(Math.ceil(computeUnitInSamples(
                SAMPLE_RATE, 
                7.645,
                "msec"
            )))
        )
        if ("0-ref5".length) {
            NT_delwrite_t_setDelayName(N_n_5_23_state, "0-ref5")
        }
    
                COLD_0(G_msg_EMPTY_MESSAGE)
COLD_1(G_msg_EMPTY_MESSAGE)
COLD_2(G_msg_EMPTY_MESSAGE)
COLD_3(G_msg_EMPTY_MESSAGE)
COLD_4(G_msg_EMPTY_MESSAGE)
COLD_5(G_msg_EMPTY_MESSAGE)
COLD_6(G_msg_EMPTY_MESSAGE)
COLD_7(G_msg_EMPTY_MESSAGE)
COLD_8(G_msg_EMPTY_MESSAGE)
COLD_9(G_msg_EMPTY_MESSAGE)
COLD_10(G_msg_EMPTY_MESSAGE)
COLD_11(G_msg_EMPTY_MESSAGE)
COLD_12(G_msg_EMPTY_MESSAGE)
COLD_13(G_msg_EMPTY_MESSAGE)
COLD_14(G_msg_EMPTY_MESSAGE)
COLD_15(G_msg_EMPTY_MESSAGE)
COLD_16(G_msg_EMPTY_MESSAGE)
COLD_17(G_msg_EMPTY_MESSAGE)
COLD_18(G_msg_EMPTY_MESSAGE)
COLD_19(G_msg_EMPTY_MESSAGE)
COLD_20(G_msg_EMPTY_MESSAGE)
COLD_21(G_msg_EMPTY_MESSAGE)
COLD_22(G_msg_EMPTY_MESSAGE)
COLD_23(G_msg_EMPTY_MESSAGE)
COLD_24(G_msg_EMPTY_MESSAGE)
            },
            dspLoop: (INPUT, OUTPUT) => {
                
        for (IT_FRAME = 0; IT_FRAME < BLOCK_SIZE; IT_FRAME++) {
            G_commons__emitFrame(FRAME)
            
                N_n_1_2_outs_0 = Math.cos(N_n_1_2_state.phase)
                N_n_1_2_state.phase += N_n_1_2_state.step
            
NT_osc_t_setStep(N_n_1_4_state, ((N_m_n_1_1_0_sig_state.currentValue) + (N_n_1_2_outs_0 * (N_m_n_1_14_1_sig_state.currentValue))))

                N_n_1_4_outs_0 = Math.cos(N_n_1_4_state.phase)
                N_n_1_4_state.phase += N_n_1_4_state.step
            

        N_n_1_5_outs_0 = N_n_1_5_state.currentValue
        if (toFloat(FRAME) < N_n_1_5_state.currentLine.p1.x) {
            N_n_1_5_state.currentValue += N_n_1_5_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_1_5_state.currentLine.p1.x) {
                N_n_1_5_state.currentValue = N_n_1_5_state.currentLine.p1.y
            }
        }
    
N_n_1_7_outs_0 = N_n_1_5_outs_0 * N_n_1_5_outs_0

                N_n_1_26_outs_0 = Math.cos(N_n_1_26_state.phase)
                N_n_1_26_state.phase += N_n_1_26_state.step
            
NT_osc_t_setStep(N_n_1_28_state, ((N_m_n_1_25_0_sig_state.currentValue) + (N_n_1_26_outs_0 * (N_m_n_1_38_1_sig_state.currentValue))))

                N_n_1_28_outs_0 = Math.cos(N_n_1_28_state.phase)
                N_n_1_28_state.phase += N_n_1_28_state.step
            

        N_n_1_29_outs_0 = N_n_1_29_state.currentValue
        if (toFloat(FRAME) < N_n_1_29_state.currentLine.p1.x) {
            N_n_1_29_state.currentValue += N_n_1_29_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_1_29_state.currentLine.p1.x) {
                N_n_1_29_state.currentValue = N_n_1_29_state.currentLine.p1.y
            }
        }
    
N_n_1_31_outs_0 = N_n_1_29_outs_0 * N_n_1_29_outs_0

                N_n_1_42_outs_0 = Math.cos(N_n_1_42_state.phase)
                N_n_1_42_state.phase += N_n_1_42_state.step
            
NT_osc_t_setStep(N_n_1_44_state, ((N_m_n_1_41_0_sig_state.currentValue) + (N_n_1_42_outs_0 * (N_m_n_1_54_1_sig_state.currentValue))))

                N_n_1_44_outs_0 = Math.cos(N_n_1_44_state.phase)
                N_n_1_44_state.phase += N_n_1_44_state.step
            

        N_n_1_45_outs_0 = N_n_1_45_state.currentValue
        if (toFloat(FRAME) < N_n_1_45_state.currentLine.p1.x) {
            N_n_1_45_state.currentValue += N_n_1_45_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_1_45_state.currentLine.p1.x) {
                N_n_1_45_state.currentValue = N_n_1_45_state.currentLine.p1.y
            }
        }
    
N_n_1_47_outs_0 = N_n_1_45_outs_0 * N_n_1_45_outs_0

                N_n_2_2_outs_0 = Math.cos(N_n_2_2_state.phase)
                N_n_2_2_state.phase += N_n_2_2_state.step
            
NT_osc_t_setStep(N_n_2_4_state, ((N_m_n_2_1_0_sig_state.currentValue) + (N_n_2_2_outs_0 * (N_m_n_2_14_1_sig_state.currentValue))))

                N_n_2_4_outs_0 = Math.cos(N_n_2_4_state.phase)
                N_n_2_4_state.phase += N_n_2_4_state.step
            

        N_n_2_5_outs_0 = N_n_2_5_state.currentValue
        if (toFloat(FRAME) < N_n_2_5_state.currentLine.p1.x) {
            N_n_2_5_state.currentValue += N_n_2_5_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_2_5_state.currentLine.p1.x) {
                N_n_2_5_state.currentValue = N_n_2_5_state.currentLine.p1.y
            }
        }
    
N_n_2_7_outs_0 = N_n_2_5_outs_0 * N_n_2_5_outs_0

                N_n_2_26_outs_0 = Math.cos(N_n_2_26_state.phase)
                N_n_2_26_state.phase += N_n_2_26_state.step
            
NT_osc_t_setStep(N_n_2_28_state, ((N_m_n_2_25_0_sig_state.currentValue) + (N_n_2_26_outs_0 * (N_m_n_2_38_1_sig_state.currentValue))))

                N_n_2_28_outs_0 = Math.cos(N_n_2_28_state.phase)
                N_n_2_28_state.phase += N_n_2_28_state.step
            

        N_n_2_29_outs_0 = N_n_2_29_state.currentValue
        if (toFloat(FRAME) < N_n_2_29_state.currentLine.p1.x) {
            N_n_2_29_state.currentValue += N_n_2_29_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_2_29_state.currentLine.p1.x) {
                N_n_2_29_state.currentValue = N_n_2_29_state.currentLine.p1.y
            }
        }
    
N_n_2_31_outs_0 = N_n_2_29_outs_0 * N_n_2_29_outs_0

                N_n_2_42_outs_0 = Math.cos(N_n_2_42_state.phase)
                N_n_2_42_state.phase += N_n_2_42_state.step
            
NT_osc_t_setStep(N_n_2_44_state, ((N_m_n_2_41_0_sig_state.currentValue) + (N_n_2_42_outs_0 * (N_m_n_2_54_1_sig_state.currentValue))))

                N_n_2_44_outs_0 = Math.cos(N_n_2_44_state.phase)
                N_n_2_44_state.phase += N_n_2_44_state.step
            

        N_n_2_45_outs_0 = N_n_2_45_state.currentValue
        if (toFloat(FRAME) < N_n_2_45_state.currentLine.p1.x) {
            N_n_2_45_state.currentValue += N_n_2_45_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_2_45_state.currentLine.p1.x) {
                N_n_2_45_state.currentValue = N_n_2_45_state.currentLine.p1.y
            }
        }
    
N_n_2_47_outs_0 = N_n_2_45_outs_0 * N_n_2_45_outs_0

                N_n_3_2_outs_0 = Math.cos(N_n_3_2_state.phase)
                N_n_3_2_state.phase += N_n_3_2_state.step
            
NT_osc_t_setStep(N_n_3_4_state, ((N_m_n_3_1_0_sig_state.currentValue) + (N_n_3_2_outs_0 * (N_m_n_3_14_1_sig_state.currentValue))))

                N_n_3_4_outs_0 = Math.cos(N_n_3_4_state.phase)
                N_n_3_4_state.phase += N_n_3_4_state.step
            

        N_n_3_5_outs_0 = N_n_3_5_state.currentValue
        if (toFloat(FRAME) < N_n_3_5_state.currentLine.p1.x) {
            N_n_3_5_state.currentValue += N_n_3_5_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_3_5_state.currentLine.p1.x) {
                N_n_3_5_state.currentValue = N_n_3_5_state.currentLine.p1.y
            }
        }
    
N_n_3_7_outs_0 = N_n_3_5_outs_0 * N_n_3_5_outs_0

                N_n_3_26_outs_0 = Math.cos(N_n_3_26_state.phase)
                N_n_3_26_state.phase += N_n_3_26_state.step
            
NT_osc_t_setStep(N_n_3_28_state, ((N_m_n_3_25_0_sig_state.currentValue) + (N_n_3_26_outs_0 * (N_m_n_3_38_1_sig_state.currentValue))))

                N_n_3_28_outs_0 = Math.cos(N_n_3_28_state.phase)
                N_n_3_28_state.phase += N_n_3_28_state.step
            

        N_n_3_29_outs_0 = N_n_3_29_state.currentValue
        if (toFloat(FRAME) < N_n_3_29_state.currentLine.p1.x) {
            N_n_3_29_state.currentValue += N_n_3_29_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_3_29_state.currentLine.p1.x) {
                N_n_3_29_state.currentValue = N_n_3_29_state.currentLine.p1.y
            }
        }
    
N_n_3_31_outs_0 = N_n_3_29_outs_0 * N_n_3_29_outs_0

                N_n_3_42_outs_0 = Math.cos(N_n_3_42_state.phase)
                N_n_3_42_state.phase += N_n_3_42_state.step
            
NT_osc_t_setStep(N_n_3_44_state, ((N_m_n_3_41_0_sig_state.currentValue) + (N_n_3_42_outs_0 * (N_m_n_3_54_1_sig_state.currentValue))))

                N_n_3_44_outs_0 = Math.cos(N_n_3_44_state.phase)
                N_n_3_44_state.phase += N_n_3_44_state.step
            

        N_n_3_45_outs_0 = N_n_3_45_state.currentValue
        if (toFloat(FRAME) < N_n_3_45_state.currentLine.p1.x) {
            N_n_3_45_state.currentValue += N_n_3_45_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_3_45_state.currentLine.p1.x) {
                N_n_3_45_state.currentValue = N_n_3_45_state.currentLine.p1.y
            }
        }
    
N_n_3_47_outs_0 = N_n_3_45_outs_0 * N_n_3_45_outs_0
N_n_0_81_outs_0 = ((((N_n_1_4_outs_0 * (N_n_1_7_outs_0 * N_n_1_7_outs_0)) + ((N_n_1_28_outs_0 * (N_n_1_31_outs_0 * N_n_1_31_outs_0)) + (N_n_1_44_outs_0 * (N_n_1_47_outs_0 * N_n_1_47_outs_0)))) + (((N_n_2_4_outs_0 * (N_n_2_7_outs_0 * N_n_2_7_outs_0)) + ((N_n_2_28_outs_0 * (N_n_2_31_outs_0 * N_n_2_31_outs_0)) + (N_n_2_44_outs_0 * (N_n_2_47_outs_0 * N_n_2_47_outs_0)))) + ((N_n_3_4_outs_0 * (N_n_3_7_outs_0 * N_n_3_7_outs_0)) + ((N_n_3_28_outs_0 * (N_n_3_31_outs_0 * N_n_3_31_outs_0)) + (N_n_3_44_outs_0 * (N_n_3_47_outs_0 * N_n_3_47_outs_0)))))) + ((G_sigBuses_read(N_n_0_98_state.busName)) * (N_m_n_0_110_1_sig_state.currentValue))) * (N_m_n_0_81_1_sig_state.currentValue)
N_n_5_14_outs_0 = G_buf_readSample(N_n_5_14_state.buffer, N_n_5_14_state.offset)
N_n_5_1_outs_0 = N_n_0_81_outs_0 + N_n_5_14_outs_0
N_n_5_16_outs_0 = G_buf_readSample(N_n_5_16_state.buffer, N_n_5_16_state.offset)
N_n_5_2_outs_0 = N_n_5_1_outs_0 + N_n_5_16_outs_0
N_n_5_18_outs_0 = G_buf_readSample(N_n_5_18_state.buffer, N_n_5_18_state.offset)
N_n_5_5_outs_0 = N_n_5_2_outs_0 + N_n_5_18_outs_0
N_n_5_20_outs_0 = G_buf_readSample(N_n_5_20_state.buffer, N_n_5_20_state.offset)
N_n_5_7_outs_0 = N_n_5_5_outs_0 + N_n_5_20_outs_0
N_n_5_24_outs_0 = G_buf_readSample(N_n_5_24_state.buffer, N_n_5_24_state.offset)
N_n_4_16_outs_0 = G_buf_readSample(N_n_4_16_state.buffer, N_n_4_16_state.offset)
N_n_4_34_state.previous = N_n_4_34_outs_0 = N_n_4_34_state.coeff * N_n_4_16_outs_0 + (1 - N_n_4_34_state.coeff) * N_n_4_34_state.previous

        N_n_4_48_outs_0 = N_n_4_48_state.currentValue
        if (toFloat(FRAME) < N_n_4_48_state.currentLine.p1.x) {
            N_n_4_48_state.currentValue += N_n_4_48_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_4_48_state.currentLine.p1.x) {
                N_n_4_48_state.currentValue = N_n_4_48_state.currentLine.p1.y
            }
        }
    

        N_n_4_15_outs_0 = N_n_4_15_state.currentValue
        if (toFloat(FRAME) < N_n_4_15_state.currentLine.p1.x) {
            N_n_4_15_state.currentValue += N_n_4_15_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_4_15_state.currentLine.p1.x) {
                N_n_4_15_state.currentValue = N_n_4_15_state.currentLine.p1.y
            }
        }
    
N_n_4_9_outs_0 = (N_n_5_7_outs_0 + N_n_5_24_outs_0) + ((N_n_4_16_outs_0 + ((N_n_4_34_outs_0 - N_n_4_16_outs_0) * N_n_4_48_outs_0)) * N_n_4_15_outs_0)

        N_n_4_14_outs_0 = N_n_4_14_state.currentValue
        if (toFloat(FRAME) < N_n_4_14_state.currentLine.p1.x) {
            N_n_4_14_state.currentValue += N_n_4_14_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_4_14_state.currentLine.p1.x) {
                N_n_4_14_state.currentValue = N_n_4_14_state.currentLine.p1.y
            }
        }
    
N_n_5_22_outs_0 = G_buf_readSample(N_n_5_22_state.buffer, N_n_5_22_state.offset)
N_n_4_17_outs_0 = G_buf_readSample(N_n_4_17_state.buffer, N_n_4_17_state.offset)
N_n_4_52_state.previous = N_n_4_52_outs_0 = N_n_4_52_state.coeff * N_n_4_17_outs_0 + (1 - N_n_4_52_state.coeff) * N_n_4_52_state.previous
N_n_4_10_outs_0 = N_n_5_22_outs_0 + ((N_n_4_17_outs_0 + ((N_n_4_52_outs_0 - N_n_4_17_outs_0) * N_n_4_48_outs_0)) * N_n_4_15_outs_0)
OUTPUT[0][IT_FRAME] = ((N_n_4_9_outs_0 * N_n_4_14_outs_0) + N_n_0_81_outs_0)
OUTPUT[1][IT_FRAME] = ((N_n_4_10_outs_0 * N_n_4_14_outs_0) + N_n_0_81_outs_0)

                N_n_0_88_outs_0 = Math.cos(N_n_0_88_state.phase)
                N_n_0_88_state.phase += N_n_0_88_state.step
            

                N_n_0_89_outs_0 = Math.cos(N_n_0_89_state.phase)
                N_n_0_89_state.phase += N_n_0_89_state.step
            

        N_n_0_87_outs_0 = N_n_0_87_state.currentValue
        if (toFloat(FRAME) < N_n_0_87_state.currentLine.p1.x) {
            N_n_0_87_state.currentValue += N_n_0_87_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_0_87_state.currentLine.p1.x) {
                N_n_0_87_state.currentValue = N_n_0_87_state.currentLine.p1.y
            }
        }
    

        G_sigBuses_set(N_n_0_97_state.busName, ((N_n_0_88_outs_0 + N_n_0_89_outs_0) * N_n_0_87_outs_0))
    
N_n_4_0_outs_0 = N_n_4_9_outs_0 + N_n_4_10_outs_0
N_n_4_18_outs_0 = G_buf_readSample(N_n_4_18_state.buffer, N_n_4_18_state.offset)
N_n_4_56_state.previous = N_n_4_56_outs_0 = N_n_4_56_state.coeff * N_n_4_18_outs_0 + (1 - N_n_4_56_state.coeff) * N_n_4_56_state.previous
N_n_4_4_outs_0 = (N_n_4_18_outs_0 + ((N_n_4_56_outs_0 - N_n_4_18_outs_0) * N_n_4_48_outs_0)) * N_n_4_15_outs_0
N_n_4_19_outs_0 = G_buf_readSample(N_n_4_19_state.buffer, N_n_4_19_state.offset)
N_n_4_60_state.previous = N_n_4_60_outs_0 = N_n_4_60_state.coeff * N_n_4_19_outs_0 + (1 - N_n_4_60_state.coeff) * N_n_4_60_state.previous
N_n_4_2_outs_0 = (N_n_4_19_outs_0 + ((N_n_4_60_outs_0 - N_n_4_19_outs_0) * N_n_4_48_outs_0)) * N_n_4_15_outs_0
N_n_4_12_outs_0 = N_n_4_4_outs_0 + N_n_4_2_outs_0
G_buf_writeSample(N_n_4_22_state.buffer, (N_n_4_0_outs_0 + N_n_4_12_outs_0))
N_n_4_13_outs_0 = N_n_4_9_outs_0 - N_n_4_10_outs_0
N_n_4_11_outs_0 = N_n_4_4_outs_0 - N_n_4_2_outs_0
G_buf_writeSample(N_n_4_23_state.buffer, (N_n_4_13_outs_0 + N_n_4_11_outs_0))
G_buf_writeSample(N_n_4_24_state.buffer, (N_n_4_0_outs_0 - N_n_4_12_outs_0))
G_buf_writeSample(N_n_4_25_state.buffer, (N_n_4_13_outs_0 - N_n_4_11_outs_0))
G_buf_writeSample(N_n_5_13_state.buffer, N_n_0_81_outs_0)
G_buf_writeSample(N_n_5_15_state.buffer, (N_n_0_81_outs_0 - N_n_5_14_outs_0))
G_buf_writeSample(N_n_5_17_state.buffer, (N_n_5_1_outs_0 - N_n_5_16_outs_0))
G_buf_writeSample(N_n_5_19_state.buffer, (N_n_5_2_outs_0 - N_n_5_18_outs_0))
G_buf_writeSample(N_n_5_21_state.buffer, (N_n_5_7_outs_0 - N_n_5_24_outs_0))
G_buf_writeSample(N_n_5_23_state.buffer, (N_n_5_5_outs_0 - N_n_5_20_outs_0))
            FRAME++
        }
    
            },
            io: {
                messageReceivers: {
                    n_0_70: {
                            "0": IO_rcv_n_0_70_0,
                        },
n_0_100: {
                            "0": IO_rcv_n_0_100_0,
                        },
n_0_101: {
                            "0": IO_rcv_n_0_101_0,
                        },
n_0_102: {
                            "0": IO_rcv_n_0_102_0,
                        },
n_0_103: {
                            "0": IO_rcv_n_0_103_0,
                        },
n_0_104: {
                            "0": IO_rcv_n_0_104_0,
                        },
n_0_105: {
                            "0": IO_rcv_n_0_105_0,
                        },
n_0_106: {
                            "0": IO_rcv_n_0_106_0,
                        },
n_0_60: {
                            "0": IO_rcv_n_0_60_0,
                        },
n_0_67: {
                            "0": IO_rcv_n_0_67_0,
                        },
n_0_68: {
                            "0": IO_rcv_n_0_68_0,
                        },
n_0_95: {
                            "0": IO_rcv_n_0_95_0,
                        },
n_0_117: {
                            "0": IO_rcv_n_0_117_0,
                        },
                },
                messageSenders: {
                    n_0_70: {
                            "0": () => undefined,
                        },
n_0_100: {
                            "0": () => undefined,
                        },
n_0_101: {
                            "0": () => undefined,
                        },
n_0_102: {
                            "0": () => undefined,
                        },
n_0_103: {
                            "0": () => undefined,
                        },
n_0_104: {
                            "0": () => undefined,
                        },
n_0_105: {
                            "0": () => undefined,
                        },
n_0_106: {
                            "0": () => undefined,
                        },
n_0_71: {
                            "0": () => undefined,
                        },
n_0_73: {
                            "0": () => undefined,
                        },
n_0_78: {
                            "0": () => undefined,
                        },
n_0_96: {
                            "0": () => undefined,
                        },
n_0_99: {
                            "0": () => undefined,
                        },
n_0_109: {
                            "0": () => undefined,
                        },
                },
            }
        }

        
exports.G_commons_getArray = G_commons_getArray
exports.G_commons_setArray = G_commons_setArray
    