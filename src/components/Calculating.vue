<template>
  <form class="calculate" @input="calculating">
    <div v-for="(time, timeKey) in input.times" :key="timeKey"
         class="calculate__group"
         :class="{'padding': Array.isArray(input.times) && input.times.length > 1}"
    >
      <label class="calculate__label">
        <span v-if="timeKey === 0"
              class="calculate__label_title"
        >Отработано часов</span>
        <imask-input
          v-model="time.hours"
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
    >Добавить время</button>

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
        times: [{
          hours: null,
          minutes: null
        }],
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
    sumTime () {
      let time = 0

      this.input.times.forEach(el => {
        if (el.hours) {
          time += parseInt(el.hours)
        }

        if (el.minutes) {
          time += parseFloat(el.minutes) / 60
        }
      })

      return time
    }
  },
  methods: {
    calculating () {
      // eslint-disable-next-line
      const { rate, salary, advanceValue, deductAnAdvance, inPercent } = this.input

      const yourMoney = this.sumTime * parseFloat(rate)

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
    },
    addTime () {
      this.input.times.push({
        hours: null,
        minutes: null
      })
    },
    removeTime (index) {
      const newTimes = []

      this.input.times.forEach((time, timeIndex) => {
        if (timeIndex !== index) {
          newTimes.push(JSON.parse(JSON.stringify(time)))
        }
      })

      this.input.times = newTimes
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
    max-width: 460px;
    width: 100%;
    padding: 16px;
    user-select: none;

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
        right: -28px - 12px;
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
