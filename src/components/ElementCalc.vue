<template>
    <el-container class="calculate">
        <el-col>
            <el-row :gutter="18"
                    type="flex"
                    justify="center"
            >
                <el-col :sm="12"
                        :xs="24"
                >
                    <h2>Подсчет заработанных денег</h2>
                </el-col>
            </el-row>

            <el-row type="flex"
                    :gutter="18"
                    align="center"
                    justify="center"
            >
                <el-col :xl="8"
                        :lg="12"
                        :md="14"
                        :sm="18"
                        :xs="24"
                >
                    <el-form label-width="200px">
                        <el-form-item v-for="(time, timeKey) in input.times"
                                      :key="timeKey"
                                      required
                        >
                            <span v-if="timeKey === 0"
                                  slot="label"
                            >Затраченное время</span>

                            <el-col :span="input.times.length > 1 ? 10 : 12">
                                <el-input-number v-model="time.hours"
                                                 placeholder="Часы"
                                                 step-strictly
                                                 :min="0"
                                                 :step="1"
                                />
                            </el-col>

                            <el-col :span="input.times.length > 1 ? 10 : 12">
                                <el-input-number v-model="time.minutes"
                                                 placeholder="Минуты"
                                                 :step="1"
                                                 step-strictly
                                                 :min="0"
                                                 :max="59"
                                />
                            </el-col>

                            <el-col v-if="input.times.length > 1"
                                    :span="4"
                            >
                                <el-button type="danger"
                                           icon="el-icon-delete"
                                           plain
                                           class="calculate__time-buttons_mini"
                                           @click="removeTime(timeKey)"
                                />
                            </el-col>
                        </el-form-item>

                        <el-form-item>
                            <el-button-group class="calculate__time-buttons">
                                <el-button type="primary"
                                           icon="el-icon-plus"
                                           class="calculate__time-buttons_item"
                                           @click="input.times.push({ hours: '', minutes: '' })"
                                >
                                    Добавить время
                                </el-button>

                                <el-button icon="el-icon-minus"
                                           class="calculate__time-buttons_item"
                                           :disabled="input.times.length === 1"
                                           @click="removeTime(input.times.length - 1)"
                                >
                                    Удалить время
                                </el-button>
                            </el-button-group>
                        </el-form-item>

                        <el-form-item label="Зарплата"
                                      required
                        >
                            <el-col :span="12">
                                <el-input v-model="input.rate"
                                          placeholder="Ставка"
                                />
                            </el-col>

                            <el-col :span="12">
                                <el-input v-model="input.advance"
                                          placeholder="Аванс"
                                          :disabled="false"
                                />
                            </el-col>
                        </el-form-item>

                        <el-form-item label="Дополнительно">
                            <el-col :span="12">
                                <el-input v-model="input.desired"
                                          placeholder="Желаемая сумма"
                                          :disabled="false"
                                />
                            </el-col>

                            <el-col :span="12">
                                <el-input v-model="input.paidOut"
                                          placeholder="Выплачено"
                                />
                            </el-col>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>

            <transition type="fade">
                <el-row v-if="isTableShow"
                        type="flex"
                        :gutter="18"
                        align="center"
                        justify="center"
                >
                    <el-col :xl="8"
                            :lg="12"
                            :md="14"
                            :sm="18"
                            :xs="24"
                    >
                        <el-table :data="table"
                                  empty-text="—"
                                  max-height="250"
                                  :span-method="tableColSpan"
                                  border
                                  stripe
                        >
                            <el-table-column prop="name"
                                             label="Тип"
                                             fixed
                            />
                            <el-table-column prop="money"
                                             label="Заработано"
                                             align="right"
                                             :width="115"
                                             class-name="el-table__cell-custom"
                            />
                            <el-table-column v-if="formatDesired"
                                             prop="moneyLeft"
                                             label="Осталось (рубли)"
                                             align="right"
                                             :width="145"
                                             class-name="el-table__cell-custom"
                            />
                            <el-table-column v-if="formatDesired"
                                             prop="timeLeft"
                                             label="Осталось (время)"
                                             align="right"
                                             :width="145"
                                             class-name="el-table__cell-custom"
                            />
                        </el-table>
                    </el-col>
                </el-row>
            </transition>
        </el-col>
    </el-container>
</template>

<script>
    export default {
        name: 'ElementCalc',
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
                regExp: /^((\d{1,3})(?:\s[0-9]{3})?|(\d)(?:\s[0-9]{3}){0,2}|(\d{1,7}))(\.\d{1,2})?$/g,
                localStorageKey: 'earned_by_hours'
            }
        },
        computed: {
            timeSum() /* number */ {
                const { times } = this.input;

                let timeSum /* number */ = 0;

                times.forEach(time /* Object */ => {
                    timeSum += time.hours ? time.hours : 0;
                    timeSum += time.minutes ? time.minutes / 60 : 0;
                });

                return timeSum
            },

            formatRate() /* number */ {
                const { rate } = this.input;

                return this.formatStringToMoney(rate);
            },

            formatAdvance() /* number */ {
                const { advance } = this.input;

                return this.formatStringToMoney(advance);
            },

            formatPaidOut() /* number */ {
                const { paidOut } = this.input;

                return this.formatStringToMoney(paidOut);
            },

            formatDesired() /* number */ {
                const { desired } = this.input;

                return this.formatStringToMoney(desired);
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
                const { result } = this;
                const main /* object */ = result.find(item => item.main);

                if (!main.money) return []

                const formattedObj /* object */ = obj /* object */ => ({
                    ...this.desiredLeft(obj.money),
                    name: obj.name,
                    money: obj.money,
                });
                const formattedResult /* object */ = [formattedObj(main)]

                result.forEach(obj /* object */ => {
                    if (!obj.main && obj.money && obj.money !== main.money) {
                        formattedResult.push(formattedObj(obj))
                    }
                });

                return formattedResult
            },

            isTableShow() {
                return this.table.length
            },

            earned() /* number */ {
                const rate /* number|boolean */ = this.formatRate;
                const { timeSum } = this;

                return rate ? this.mathRound(rate * timeSum) : 0;
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
                const { earned } = this;
                const advance /* number */ = this.formatAdvance;
                const paidOut /* number */ = this.formatPaidOut;
                const res /* number */ = this.mathRound(earned - advance - paidOut);

                return res > 0 ? res : 0
            },
        },
        updated() {
            this.setLocalStorage();
        },
        created() {
            this.getLocalStorage();
        },
        methods: {
            removeTime(index = this.input.times.length - 1) {
                this.$set(this.input, 'times', this.input.times.filter((item, idx) => index !== idx))
            },

            formatStringToMoney(str) {
                const { regExp } = this

                if (str.match(regExp)) {
                    return this.mathRound(str)
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
                    const timeStr /* string */ = time.toString(10);
                    const strArr /* string[] */ = timeStr.split('.');
                    const hours /* number */ = parseInt(strArr[0], 10);
                    const min /* number */ = Math.round((time - hours) * 60);

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
                const rate /* number */ = this.formatRate;
                const desired /* number */ = this.formatDesired;
                const moneyLeft /* number */ = desired - money;
                const timeLeft /* number */ = moneyLeft / rate;

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
                    moneyLeft: 'Цель достигнута! 😇',
                    success: true
                }
            },

            // eslint-disable-next-line consistent-return
            tableColSpan({
                row, columnIndex
            }) {
                const {
                    success
                } = row;

                if (success && columnIndex === 2) {
                    return [1, 2]
                }

                if (success && columnIndex === 3) {
                    return [0, 0]
                }
            },

            getLocalStorage() {
                const storage = localStorage.getItem(this.localStorageKey);

                if (storage) {
                    const json = JSON.parse(storage);
                    const { input } = this;
                    const keys = Object.keys(input);
                    const oldStorage = Object.keys(json).filter(key => keys.includes(key)).length;

                    if (!oldStorage) {
                        this.$set(this, 'input', json)
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
    .calculate {
        &__time-buttons {
            width: 100%;
            padding: 0 6px;

            &_mini {
                width: 100%;
            }

            &_item {
                width: 50%;
            }
        }

        .el-input-number {
            width: 100%;
        }

        .el-checkbox {
            width: 50%;
            padding: 0 8px;
            margin-right: 0;
            text-align: left;

            &-group {
                display: flex;
                align-items: flex-start;
                flex-wrap: wrap;
            }
        }
    }

    .fade {
        &-enter, &-leave-to {
            opacity: 0;
        }

        &-enter-to, &-leave {
            opacity: 1;
        }

        &-enter-active, &-leave-active {
            transition: opacity .3s;
        }
    }
</style>

<style lang="scss">
    .calculate {
        .el-table {
            border-radius: 4px;

            .cell {
                word-break: initial;
            }

            &__cell-custom {
                .cell {
                    font-weight: 700;
                }
            }
        }
    }
</style>
