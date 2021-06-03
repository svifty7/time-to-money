<template>
    <div class="calculate">
        <h1 class="calculate__title">
            Подсчет заработанных денег
        </h1>

        <form class="calculate__body">
            <div v-for="(time, timeKey) in input.times"
                 :key="timeKey"
                 class="calculate__group"
                 :class="{'padding': Array.isArray(input.times) && input.times.length > 1}"
            >
                <label class="calculate__label">
                    <span v-if="timeKey === 0"
                          class="calculate__label_title"
                          :class="{'required': timeKey === 0}"
                    >Отработано часов</span>

                    <input
                        ref="hour"
                        v-model.number.trim="time.hours"
                        class="calculate__text"
                        :mask="Number"
                        :min="0"
                        :scale="0"
                        placeholder="Часы"
                        inputmode="numeric"
                        autocomplete="off"
                        autofocus="autofocus"
                    >
                </label>

                <label class="calculate__label">
                    <span v-if="timeKey === 0"
                          class="calculate__label_title"
                    >Отработано минут</span>

                    <input
                        v-model.number.trim="time.minutes"
                        class="calculate__text"
                        :mask="Number"
                        :min="0"
                        :max="59"
                        :scale="0"
                        placeholder="Минуты"
                        inputmode="numeric"
                        autocomplete="off"
                    >
                </label>

                <button v-if="input.times.length > 1"
                        type="button"
                        class="calculate__rm"
                        @click.prevent="removeTime(timeKey)"
                />
            </div>

            <div class="calculate__group">
                <button type="button"
                        class="calculate__btn"
                        @click.prevent="input.times.push({ hours: '', minutes: '' })"
                >
                    Добавить время
                </button>

                <button type="button"
                        class="calculate__btn not-sm"
                        @click.prevent="input.times.push({ hours: '', minutes: '' })"
                >
                    Удалить время
                </button>
            </div>

            <div class="calculate__group">
                <label class="calculate__label">
                    <span class="calculate__label_title required">Ставка</span>
                    <imask-input
                        v-model="input.rate"
                        class="calculate__text"
                        :mask="Number"
                        :min="0"
                        :scale="2"
                        placeholder="Ставка"
                        inputmode="decimal"
                        autocomplete="on"
                    />
                </label>

                <label class="calculate__label">
                    <span class="calculate__label_title">Аванс</span>
                    <imask-input
                        v-model="input.advance"
                        class="calculate__text"
                        :mask="Number"
                        :min="0"
                        :scale="2"
                        placeholder="Размер вычета"
                        inputmode="decimal"
                        autocomplete="on"
                    />
                </label>
            </div>

            <div class="calculate__group">
                <label class="calculate__label">
                    <span class="calculate__label_title">Желаемая сумма</span>
                    <imask-input
                        v-model="input.desired"
                        class="calculate__text"
                        :mask="Number"
                        :min="0"
                        :scale="2"
                        placeholder="Сумма"
                        inputmode="decimal"
                        autocomplete="on"
                    />
                </label>

                <label class="calculate__label">
                    <span class="calculate__label_title">Выплачено дополнительно</span>
                    <imask-input
                        v-model="input.paidOut"
                        class="calculate__text"
                        :mask="Number"
                        :min="0"
                        :scale="2"
                        placeholder="Сумма"
                        inputmode="decimal"
                        autocomplete="on"
                    />
                </label>
            </div>
        </form>

        <table class="calculate__table">
            <thead class="calculate__table_head">
                <th class="calculate__table_cell">
                    Наименование
                </th>
                <th class="calculate__table_cell value">
                    Заработано (рубли)
                </th>
                <th class="calculate__table_cell value">
                    Осталось (рубли)
                </th>
                <th class="calculate__table_cell value">
                    Осталось (время)
                </th>
            </thead>

            <tbody>
                <tr v-for="(row, rowKey) in table"
                    :key="rowKey"
                    class="calculate__table_row"
                >
                    <td class="calculate__table_cell">
                        {{ row.name }}
                    </td>
                    <td class="calculate__table_cell value">
                        {{ row.money }}
                    </td>
                    <td class="calculate__table_cell value">
                        {{ row.moneyLeft }}
                    </td>
                    <td class="calculate__table_cell value">
                        {{ row.timeLeft }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { IMaskComponent } from 'vue-imask'

    export default {
        name: 'Calculating',
        components: {
            'imask-input': IMaskComponent
        },
        data() {
            return {
                input: {
                    times: [{
                        hours: '',
                        minutes: ''
                    }], // Время
                    rate: '', // Ставка
                    advance: '', // Аванс
                    paidOut: '', // Выплачено
                    desired: '' // Желаемая сумма
                },
                regExp: /^((\d{1,3})(?:[0-9]{3})?|(\d)(?:[0-9]{3}){0,2}|(\d{1,7}))(\.\d{1,2})?$/g,
                localStorageKey: 'earned_by_hours'
            }
        },
        computed: {
            timeSum() /* number */ {
                const { times } = this.input

                let timeSum /* number */ = 0

                times.forEach(time /* Object */ => {
                    timeSum += time.hours ? time.hours : 0
                    timeSum += time.minutes ? time.minutes / 60 : 0
                })

                return timeSum
            },

            formatRate() /* number */ {
                const { rate } = this.input

                return this.formatStringToMoney(rate)
            },

            formatAdvance() /* number */ {
                const { advance } = this.input

                return this.formatStringToMoney(advance)
            },

            formatPaidOut() /* number */ {
                const { paidOut } = this.input

                return this.formatStringToMoney(paidOut)
            },

            formatDesired() /* number */ {
                const { desired } = this.input

                return this.formatStringToMoney(desired)
            },

            result() /* Array */ {
                return [{
                    name: 'Всего за месяц',
                    money: this.earned,
                    main: true
                }, {
                    name: 'После вычета аванса',
                    money: this.earnedAdvance,
                }, {
                    name: 'После вычета выплаченного',
                    money: this.earnedPaidOut,
                }, {
                    name: 'После всех выплат',
                    money: this.earnedAdvanceAndPaidOut,
                }]
            },

            table() /* object */ {
                const { result } = this
                const main /* object */ = result.find(item => item.main)

                if (!main.money) return []

                const formattedObj /* object */ = obj /* object */ => ({
                    ...this.desiredLeft(obj.money),
                    name: obj.name,
                    money: obj.money,
                })
                const formattedResult /* object */ = [formattedObj(main)]

                result.forEach(obj /* object */ => {
                    if (!obj.main && obj.money && obj.money !== main.money) {
                        formattedResult.push(formattedObj(obj))
                    }
                })

                return formattedResult
            },

            isTableShow() {
                return this.table.length
            },

            earned() /* number */ {
                const rate /* number|boolean */ = this.formatRate
                const { timeSum } = this

                return rate ? this.mathRound(rate * timeSum) : 0
            },

            earnedAdvance() /* number */ {
                return this.earned - this.formatAdvance > 0
                    ? this.mathRound(this.earned - this.formatAdvance)
                    : 0
            },

            earnedPaidOut() /* number */ {
                return this.earned - this.formatPaidOut > 0
                    ? this.mathRound(this.earned - this.formatPaidOut)
                    : 0
            },

            earnedAdvanceAndPaidOut() /* number */ {
                const { earned } = this
                const advance /* number */ = this.formatAdvance
                const paidOut /* number */ = this.formatPaidOut
                const res /* number */ = this.mathRound(earned - advance - paidOut)

                return res > 0 ? res : 0
            },
        },
        updated() {
            this.setLocalStorage()
        },
        created() {
            this.getLocalStorage()
        },
        methods: {
            removeTime(index = this.input.times.length - 1) {
                this.$set(this.input, 'times', this.input.times.filter((item, idx) => index !== idx))
            },

            formatStringToMoney(str) {
                const { regExp } = this
                let formatString = str.replace(/,/g, '.')

                formatString = formatString.replace(/\s/g, '')

                if (formatString.match(regExp)) {
                    return this.mathRound(formatString)
                }

                return 0
            },

            mathRound(number) {
                return Math.round(number * 100) / 100
            },

            convertTimeToObj(time) {
                let timeObj = {
                    hours: 0,
                    min: 0
                }

                if (time) {
                    const timeStr /* string */ = time.toString(10)
                    const strArr /* string[] */ = timeStr.split('.')
                    const hours /* number */ = parseInt(strArr[0], 10)
                    const min /* number */ = Math.round((time - hours) * 60)

                    timeObj = {
                        hours,
                        min
                    }
                }

                return timeObj
            },

            createTimeStr(time) {
                const {
                    hours,
                    min
                } = this.convertTimeToObj(time)

                if (hours) {
                    if (min) {
                        return `${hours} ч. ${min} мин.`
                    }

                    return `${hours} ч.`
                }

                if (min <= 0) {
                    return `Несколько секунд`
                }

                return `${min} мин.`
            },

            desiredLeft(money) /* object */ {
                const rate /* number */ = this.formatRate
                const desired /* number */ = this.formatDesired
                const moneyLeft /* number */ = desired - money
                const timeLeft /* number */ = moneyLeft / rate

                if (moneyLeft > 0) {
                    return {
                        moneyLeft: moneyLeft > 0
                            ? this.mathRound(moneyLeft)
                            : 0,
                        timeLeft: timeLeft > 0
                            ? this.createTimeStr(timeLeft)
                            : 0,
                    }
                }

                return {
                    success: 'Цель достигнута! 😇'
                }
            },

            getLocalStorage() {
                const storage = localStorage.getItem(this.localStorageKey)

                if (storage) {
                    const json = JSON.parse(storage)
                    const { input } = this
                    const keys = Object.keys(input)
                    const oldStorage = Object.keys(json)
                        .filter(key => !keys.includes(key)).length

                    if (!oldStorage) {
                        this.$set(this, 'input', json)
                    } else {
                        const newStorage = {
                            rate: json.rate ? json.rate.toString(10) : '',
                            advance: json.advanceValue ? json.advanceValue.toString(10) : '',
                            desired: json.requiredAmount ? json.requiredAmount.toString(10) : '',
                            paidOut: '',
                            times: []
                        }

                        json.times.forEach(time => {
                            newStorage.times.push({
                                hours: time.hours ? parseInt(time.hours, 10) : 0,
                                minutes: time.minutes ? parseInt(time.minutes, 10) : 0,
                            })
                        })

                        this.$set(this, 'input', newStorage)
                    }
                }
            },

            setLocalStorage() {
                const json = JSON.stringify(this.input)

                localStorage.setItem(this.localStorageKey, json)
            }
        }
    }
</script>

<style lang="scss" scoped>
    $black: #2c3e50;
    $green: #42b983;
    $white: #ffffff;
    $red: #de0f07;

    .calculate {
        width: 100%;
        user-select: none;
        overflow: auto;
        max-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 16px 32px;

        &__title {
            text-align: left;
            padding: 16px 0;
            font-size: 24px;
            font-weight: 800;
            margin: 0;

            @media screen and (min-width: 562px) {
                text-align: center;
            }
        }

        &__body {
            padding: 0 0 16px;
            max-width: 460px;
            width: 100%;
        }

        input {
            border: 1px solid transparentize($black, .5);
            border-radius: 4px;
            padding: 4px 8px;
            user-select: initial;
            color: $black;
        }

        &__group {
            display: flex;
            flex-direction: column;
            position: relative;

            @media screen and (min-width: 562px) {
                flex-direction: row;
                justify-content: space-between;
            }

            .calculate__label {
                width: 100%;

                @media screen and (min-width: 562px) {
                    width: calc(50% - 6px);
                }
            }

            &.padding {
                @media screen and (min-width: 562px) {
                    padding-right: 28px + 12px;
                }
            }
        }

        &__label {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            cursor: pointer;
            margin-top: 12px;

            &_title {
                color: $black;
                margin-bottom: 4px;
                font-size: 14px;
                padding-left: 8px;

                &.required {
                    &:after {
                        content: '*';
                        color: $red;
                        margin-left: 2px;
                    }
                }
            }

            &.checkbox {
                flex-direction: row;

                .calculate__label_title {
                    margin-top: 0;
                    text-align: left;
                    padding-left: 4px;
                }
            }
        }

        &__text {
            width: 100%;
            font-size: 16px;
        }

        &__output {
            text-align: left;
            margin-top: 12px;
            width: 100%;
            max-width: 460px;

            &_value {
                font-weight: 700;
            }
        }

        &__btn {
            display: flex;
            width: 100%;
            line-height: 32px;
            padding: 0 12px;
            margin-top: 12px;
            background-color: $black;
            border: 1px solid $black;
            border-radius: 4px;
            color: $white;
            text-align: center;
            justify-content: center;
            align-items: center;
            appearance: none;
            cursor: pointer;

            @media screen and (min-width: 562px) {
                transition: all ease-in-out .2s;

                &:hover {
                    transition: all ease-in-out .2s;
                    background-color: lighten($black, 5%);
                    border-color: lighten($black, 5%);
                }
            }

            &.not-sm {
                @media screen and (max-width: 562px) {
                    display: none;
                }
            }
        }

        &__rm {
            display: flex;
            width: 100%;
            line-height: 32px;
            padding: 0 12px;
            margin-top: 12px;
            background-color: darken($red, 3%);
            border: 1px solid darken($red, 3%);
            border-radius: 4px;
            color: $white;
            text-align: center;
            justify-content: center;
            align-items: center;
            appearance: none;
            cursor: pointer;

            @media screen and (min-width: 562px) {
                width: 28px;
                height: 28px;
                position: absolute;
                right: 0;
                bottom: 0;
                transition: all ease-in-out .2s;

                &:hover {
                    transition: all ease-in-out .2s;
                    background-color: lighten($red, 3%);
                    border-color: lighten($red, 3%);
                }
            }

            &:after {
                content: 'Удалить время';

                @media screen and (min-width: 562px) {
                    transform: rotate(45deg);
                }
            }

            &:before {
                @media screen and (min-width: 562px) {
                    transform: rotate(-45deg);
                }
            }

            &:before, &:after {
                @media screen and (min-width: 562px) {
                    content: '';
                    width: 14px;
                    height: 2px;
                    display: block;
                    background-color: currentColor;
                    position: absolute;
                }
            }
        }

        &__table {
            border-collapse: collapse;
            border: 1px solid lighten($black, 40%);

            &_head {
                background-color: lighten($black, 70%);
            }

            &_row {
                border: 1px solid lighten($black, 40%);
            }

            &_cell {
                text-align: left;
                padding: 16px 8px;
                border: 1px solid lighten($black, 40%);

                &.value {
                    font-weight: 700;
                    text-align: right;
                }
            }
        }
    }

    .opacity {
        &-enter-active, &-leave-active {
            transition: all .3s ease;
        }

        &-enter, &-leave-to {
            transform: translateX(10px);
            opacity: 0;
        }
    }
</style>
