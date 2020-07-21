<template>
  <div class="calculate">
    <h1 class="calculate__title">Подсчет заработанных денег</h1>
    <form class="calculate__body"
          @input="updateStorage"
    >
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
          <imask-input
            v-model="time.hours"
            class="calculate__text"
            :mask="Number"
            :min="0"
            :scale="0"
            ref="hour"
            placeholder='Часы'
            inputmode="numeric"
            autocomplete="off"
            autofocus="autofocus"
          />
        </label>

        <label class="calculate__label">
          <span v-if="timeKey === 0"
                class="calculate__label_title"
          >Отработано минут</span>
          <imask-input
            v-model="time.minutes"
            class="calculate__text"
            :mask="Number"
            :min="0"
            :max="59"
            :scale="0"
            placeholder='Минуты'
            inputmode="numeric"
            autocomplete="off"
          />
        </label>

        <button v-if="Array.isArray(input.times) && input.times.length > 1"
                type="button"
                class="calculate__rm"
                @click.prevent="removeTime(timeKey)"
        ></button>
      </div>

      <button type="button"
              class="calculate__btn"
              @click.prevent="addTime"
      >Добавить время
      </button>

      <div class="calculate__group">
        <label class="calculate__label">
          <span class="calculate__label_title required">Ставка</span>
          <imask-input
            v-model="input.rate"
            class="calculate__text"
            :mask="Number"
            :min="0"
            :scale="2"
            placeholder='Ставка'
            inputmode="decimal"
            autocomplete="on"
          />
        </label>

        <label class="calculate__label">
          <span class="calculate__label_title">Желаемая сумма</span>
          <imask-input
            v-model="input.requiredAmount"
            class="calculate__text"
            :mask="Number"
            :min="0"
            :scale="2"
            placeholder='Сумма'
            inputmode="decimal"
            autocomplete="on"
          />
        </label>
      </div>

      <div class="calculate__group">
        <label class="calculate__label checkbox">
          <input type="checkbox"
                 class="calculate__checkbox"
                 v-model="input.deductAnAdvance">
          <span class="calculate__label_title">Вычитать аванс</span>
        </label>

        <transition name="opacity"
                    mode="out-in">
          <label class="calculate__label checkbox"
                 v-if="input.deductAnAdvance">
            <input type="checkbox"
                   class="calculate__checkbox"
                   v-model="input.inPercent">
            <span class="calculate__label_title">Аванс в процентах</span>
          </label>
        </transition>
      </div>

      <transition name="opacity"
                  mode="out-in">
        <div class="calculate__group"
             v-if="input.deductAnAdvance">
          <transition name="opacity"
                      mode="out-in">
            <label class="calculate__label"
                   v-if="input.deductAnAdvance">
              <span class="calculate__label_title">Размер вычета аванса</span>
              <imask-input
                v-model="input.advanceValue"
                class="calculate__text"
                :mask="Number"
                :min="0"
                :scale="2"
                placeholder='Размер вычета'
                inputmode="decimal"
                autocomplete="on"
              />
            </label>
          </transition>

          <transition name="opacity"
                      mode="out-in">
            <label class="calculate__label"
                   v-if="input.inPercent">
              <span class="calculate__label_title">Размер оклада</span>
              <imask-input
                v-model="input.salary"
                class="calculate__text"
                :mask="Number"
                :min="0"
                :scale="2"
                placeholder='Оклад'
                inputmode="decimal"
                autocomplete="off"
              />
            </label>
          </transition>
        </div>
      </transition>

      <div class="calculate__output">
        <span class="calculate__output_title">На руки после вычета аванса:</span>
        <span class="calculate__output_value">
          {{ ` ${ earned ? earned.toLocaleString() : 0 }&#8381;` }}
        </span>
      </div>

      <transition name="opacity"
                  mode="out-in"
      >
        <div v-if="compensateEarned"
             key="compensateEarned"
             class="calculate__output">
          <span class="calculate__output_title">На руки до вычета аванса:</span>
          <span class="calculate__output_value">
            {{ ` ${ compensateEarned }&#8381;` }}
          </span>
        </div>
      </transition>

      <transition name="opacity"
                  mode="out-in"
      >
        <div class="calculate__output"
             key="moneyLeft"
             v-if="input.requiredAmount && (timeLeft && moneyLeft > 0)">
          <span class="calculate__output_title">До желаемой суммы:</span>
          <span class="calculate__output_value">
            {{ ` ${ moneyLeft.toLocaleString() }&#8381; (${ timeLeft } при текущей ставке)` }}
          </span>
        </div>

        <div class="calculate__output"
             key="successRequired"
             v-else-if="input.requiredAmount && moneyLeft <= 0">
          <span class="calculate__output_title">Желаемая сумма достигнута.</span>
          <span class="calculate__output_value"> Поздравляю! 😇</span>
        </div>
      </transition>

      <transition name="opacity"
                  mode="out-in">
        <div class="calculate__output"
             v-if="input.requiredAmount && (compensateTimeLeft && compensateMoneyLeft > 0) && input.deductAnAdvance"
        >
          <span class="calculate__output_title">Без учета вычтенного аванса:</span>
          <span class="calculate__output_value">
            {{ ` ${ compensateMoneyLeft.toLocaleString() }&#8381; (${ compensateTimeLeft } при текущей ставке)` }}
          </span>
        </div>
      </transition>
    </form>
  </div>
</template>

<script>
  import { IMaskComponent } from 'vue-imask'

  export default {
    name: 'Calculating',
    data() {
      return {
        input: {
          times: [{
            hours: null,
            minutes: null
          }],
          requiredAmount: null,
          rate: null,
          advanceValue: '9000',
          salary: null,
          deductAnAdvance: true,
          inPercent: false
        }
      }
    },
    components: {
      'imask-input': IMaskComponent
    },
    computed: {
      sumTime() {
        let time = 0

        this.input.times.forEach(el => {
          if (el.hours) {
            time += parseInt(el.hours, 10)
          }

          if (el.minutes) {
            time += el.minutes / 60
          }
        })

        return time
      },

      earned() {
        // eslint-disable-next-line
        const { rate, salary, advanceValue, deductAnAdvance, inPercent } = this.input

        const newRate = rate ? rate.replace(/,/g, '.') : rate
        const newSalary = salary ? salary.replace(/,/g, '.') : salary
        const newAdvanceValue = advanceValue ? advanceValue.replace(/,/g, '.') : advanceValue

        const yourMoney = this.sumTime * newRate

        let earned = 0

        if (!deductAnAdvance) {
          earned = yourMoney
        } else if (advanceValue && inPercent) {
          earned = yourMoney - (newSalary * newAdvanceValue / 100)
        } else if (advanceValue && !inPercent) {
          earned = yourMoney - newAdvanceValue
        }

        return parseFloat(earned.toString()).toFixed(2)
      },

      compensateEarned() {
        return this.input.deductAnAdvance
          ? parseFloat(this.earned * 1 + this.input.advanceValue * 1).toFixed(2)
          : null
      },

      timeLeft() {
        const { rate, requiredAmount } = this.input

        if (rate && requiredAmount) {
          const newRate = rate ? rate.replace(/,/g, '.') : rate

          const timeLeft = this.moneyLeft / newRate
          const optimizedHours = parseFloat(timeLeft.toString().split('.')[0]
            ? timeLeft.toString().split('.')[0]
            : timeLeft.toString())
          const calculatedMinutes = timeLeft.toString().split('.')[1]
            ? parseFloat(timeLeft.toString().split('.')[1]) * 60 - this.sumTime
            : 0
          const optimizedMinutes = parseFloat(
            `${calculatedMinutes.toString().slice(0, 2)}.${calculatedMinutes.toString().slice(
              2,
              calculatedMinutes.toString().length
            )}`
          ).toFixed(0)

          if (optimizedMinutes > 0) {
            return `${optimizedHours}:${optimizedMinutes}`
          }
          return `${optimizedHours}:00`
        }

        return false
      },

      compensateTimeLeft() {
        const { rate, requiredAmount } = this.input

        if (rate && requiredAmount) {
          const newRate = rate ? rate.replace(/,/g, '.') : rate

          const timeLeft = this.compensateMoneyLeft / newRate
          const optimizedHours = parseFloat(timeLeft.toString().split('.')[0]
            ? timeLeft.toString().split('.')[0]
            : timeLeft.toString())
          const calculatedMinutes = timeLeft.toString().split('.')[1]
            ? parseFloat(timeLeft.toString().split('.')[1]) * 60 - this.sumTime
            : 0
          const optimizedMinutes = parseFloat(
            `${calculatedMinutes.toString().slice(0, 2)}.${calculatedMinutes.toString().slice(
              2,
              calculatedMinutes.toString().length
            )}`
          ).toFixed(0)

          if (optimizedMinutes > 0) {
            return `${optimizedHours}:${optimizedMinutes}`
          }
          return `${optimizedHours}:00`
        }

        return false
      },

      moneyLeft() {
        const { requiredAmount } = this.input

        const newRequiredAmount = requiredAmount ? requiredAmount.replace(/,/g, '.') : requiredAmount

        return newRequiredAmount - this.earned
      },

      compensateMoneyLeft() {
        const { requiredAmount, advanceValue } = this.input
        const newAdvanceValue = advanceValue ? advanceValue.replace(/,/g, '.') : advanceValue

        const newRequiredAmount = requiredAmount ? requiredAmount.replace(/,/g, '.') : requiredAmount

        return (newRequiredAmount - this.earned) - newAdvanceValue
      }
    },
    mounted() {
      const json = JSON.parse(localStorage.getItem('earned_by_hours'))

      if (localStorage.getItem('earned_by_hours')) {
        this.$set(this, 'input', json)
      }
    },
    methods: {
      addTime() {
        this.input.times.push({
          hours: null,
          minutes: null
        })

        this.$nextTick(() => {
          this.$refs.hour[this.$refs.hour.length - 1].$el.focus()
        })
      },

      removeTime(index) {
        const newTimes = []

        this.input.times.forEach((time, timeIndex) => {
          if (timeIndex !== index) {
            newTimes.push(JSON.parse(JSON.stringify(time)))
          }
        })

        this.input.times = newTimes
      },

      updateStorage() {
        const json = JSON.stringify(this.input)

        localStorage.setItem('earned_by_hours', json)
      }
    }
  }
</script>

<style lang="scss">
  $black: #2c3e50;
  $green: #42b983;
  $white: #ffffff;
  $red: #DE0F07;

  .calculate {
    width: 100%;
    user-select: none;
    overflow: auto;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    &__title {
      text-align: left;
      padding: 32px 16px 16px;
      font-size: 24px;
      font-weight: 800;
      margin: 0;

      @media screen and (min-width: 562px) {
        text-align: center;
      }
    }

    &__body {
      padding: 16px 16px 32px;
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
