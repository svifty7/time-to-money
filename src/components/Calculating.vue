<template>
  <form class="calculate" @input="calculating">
    <div class="calculate__group">
      <label class="calculate__label">
        <span class="calculate__label_title">Отработано часов</span>
        <imask-input
          v-model="input.hours"
          class="calculate__text"
          :mask="Number"
          :min="0"
          :scale="0"
          placeholder='Часы'
          inputmode="numeric"
          autocomplete="off"
          autofocus="autofocus"
        />
      </label>

      <label class="calculate__label">
        <span class="calculate__label_title">Отработано минут</span>
        <imask-input
          v-model="input.minutes"
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
    </div>

    <div class="calculate__group">
      <label class="calculate__label">
        <span class="calculate__label_title">Ставка</span>
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
    </div>

    <div class="calculate__group">
      <label class="calculate__label checkbox" @change="calculating">
        <input type="checkbox" class="calculate__checkbox" v-model="input.deductAnAdvance">
        <span class="calculate__label_title">Вычитать аванс</span>
      </label>

      <transition name="opacity" mode="out-in">
        <label class="calculate__label checkbox" v-if="input.deductAnAdvance" @change="calculating">
          <input type="checkbox" class="calculate__checkbox" v-model="input.inPercent">
          <span class="calculate__label_title">Аванс в процентах</span>
        </label>
      </transition>
    </div>

    <transition name="opacity" mode="out-in">
      <div class="calculate__group" v-if="input.deductAnAdvance">
        <transition name="opacity" mode="out-in">
          <label class="calculate__label" v-if="input.deductAnAdvance">
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

        <transition name="opacity" mode="out-in">
          <label class="calculate__label" v-if="input.inPercent">
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
      <span class="calculate__output_title">Вы заработали:</span>
      <span class="calculate__output_value">{{ ` ${ output && output >= 0 ? output : 0 }&#8381;` }}</span>
    </div>
  </form>
</template>

<script>
import { IMaskComponent } from 'vue-imask'

export default {
  name: 'Calculating',
  data () {
    return {
      output: 0,
      input: {
        rate: null,
        hours: null,
        minutes: null,
        advanceValue: null,
        salary: null,
        deductAnAdvance: false,
        inPercent: false
      }
    }
  },
  components: {
    'imask-input': IMaskComponent
  },
  methods: {
    calculating () {
      // eslint-disable-next-line
        const { rate, salary, hours, minutes, advanceValue, deductAnAdvance, inPercent } = this.input
      let time = 0
      let newMinutes

      if (minutes) {
        newMinutes = `${parseInt(minutes) / 60}`

        newMinutes = newMinutes.slice(2, newMinutes.length)
      }

      if (hours && minutes) {
        time = parseFloat(`${hours}.${newMinutes}`)
      } else if (hours) {
        time = parseInt(hours)
      } else if (minutes) {
        time = parseFloat(`0.${newMinutes}`)
      }

      const yourMoney = time * parseFloat(rate)

      if (!deductAnAdvance) {
        this.output = yourMoney
      } else {
        if (advanceValue && inPercent) {
          this.output = yourMoney - (parseFloat(salary) * parseFloat(advanceValue) / 100)
        } else if (advanceValue && !inPercent) {
          this.output = yourMoney - parseFloat(advanceValue)
        }
      }

      this.output = parseFloat(this.output.toString()).toFixed(2)
    }
  }
}
</script>

<style lang="scss">
  .calculate {
    max-width: 460px;
    width: 100%;
    padding: 16px;
    user-select: none;

    input {
      border: 1px solid transparentize(#2c3e50, .5);
      border-radius: 4px;
      padding: 4px 8px;
      user-select: initial;
      color: #2c3e50;
    }

    &__group {
      display: flex;
      flex-direction: column;

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
    }

    &__label {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      cursor: pointer;
      margin-top: 12px;

      &_title {
        color: #2c3e50;
        margin-bottom: 4px;
        font-size: 14px;
        padding-left: 8px;
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
