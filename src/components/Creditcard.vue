<template>

<div id="creditcard">
    <form ref="form" class="card-form">
      <header>
        <h1 class="card-form__title">Your card data</h1>
      </header>
      <div class="card-form-field">
        <label for="cardNumberInput" class="card-form-field__label">Number</label>
        <input  type="text"
                name="card[number]"
                v-model="card.number"
                maxlength="16"
                class="card-form-field__input"
                ref="card.number"
                required
                id="cardNumberInput" />
      </div>
      <div class="card-form-field">
        <label for="cardOwnerInput" class="card-form-field__label">Owner name</label>
        <input  type="text"
                required
                name="card[owner]"
                v-model="card.owner"
                class="card-form-field__input"
                maxlength="24"
                ref="card.owner"
                id="cardOwnerInput" />
      </div>
      <div class="card-form-field">
        <label for="" class="card-form-field__label card-form-field__label_inline">Expiration</label>
        <select v-model="card.expiration.month"
                name="card[expiration][month]"
                class="card-form-field__select"
                required
                ref="card.expiration.month">
          <option  v-for="month in months" v-bind:key="month">{{month}}</option>
        </select>
        /
        <select v-model="card.expiration.year"
                name="card[expiration][year]"
                class="card-form-field__select"
                required
                ref="card.expiration.year">
          <option v-for="year in years" v-bind:key="year">{{year}}</option>
        </select>
      </div>
      <div class="card-form-field">
        <label for="cardCvcInput" class="card-form-field__label card-form-field__label_inline">CVC</label>
        <input  type="text"
                name="card[cvc]"
                v-model="card.cvc"
                maxlength="3"
                required
                class="card-form-field__input card-form-field__input_cvc"
                id="cardCvcInput"
                ref="card.cvc" />
      </div>
      <button type="submit" class="card-form__submit" @click="BuyTickets()">Checkout</button>
    </form>

    <div class="card-preview">
      <div class="card-preview__side card-preview__side_front">
        <div class="card-preview__number">
          <div class="card-preview__label card-preview__label_white">Number</div>
          <div class="card-preview__etched-text">{{cardNumberFormatted}}</div>
        </div>

        <div class="card-preview__owner">
          <span class="card-preview__label card-preview__label_white">Owner</span>
          <span class="card-preview__etched-text">{{card.owner}}</span>
        </div>

        <div class="card-preview__expiration">
          <span class="card-preview__label card-preview__label_white">Valid thru</span>
          <span class="card-preview__etched-text">{{cardExpiration}}</span>
        </div>
      </div>
      <div class="card-preview__side card-preview__side_back">
        <div class="card-preview__cvc">
          <span class="card-preview__label">CVC</span>
          {{card.cvc}}
        </div>
      </div>
    </div>
  </div>

</template>
  
  <script>

  export default {
  name: 'creditcard',

  data: function () {
  return {
      card: {
     number: '',
      owner: '',
      expiration: {
        month: '',
        year: ''
      },
      cvc: ''
    }
     }
  },

   props: ['value'],

  methods: {

    BuyTickets: function () {
       this.$emit('eventname', this.card)
    },

    formatCardNumber: function () {
      var formattedNumber = '';
    }
  },

  computed: {

    cardNumberFormatted: function () {
      var numberChunks = this.card.number.match(/.{1,4}/g);

      if (numberChunks)
        return numberChunks.join(' ');
      else
        return '';
    },

    cardExpiration: function () {
      if (!this.card.expiration.month || !this.card.expiration.year)
        return '';

      return this.card.expiration.month + '/' + this.card.expiration.year;
    },

    months: function () {
      return [
        '01', '02', '03', '04',
        '05', '06', '07', '08',
        '09', '10', '11', '12'
      ];
    },

    years: function () {
      var years= [];
      var currentYear = (new Date()).getFullYear() % 2000;

      for (var i = 0; i < 18; i++)
        years.push(currentYear + i);

      return years;
    }
  },

  watch: {
    'card.number': function (newNumber) {
      this.card.number = newNumber.replace(/[^0-9]/gim,'');
    },
    'card.owner': function (newOwner) {
      this.card.owner = newOwner.toUpperCase().replace(/[^A-Z\s]/gim,'')
    },
    'card.cvc': function (newCvc) {
      this.card.cvc = newCvc.replace(/[^0-9]/gim,'');
    }
  },

  mounted: function () {
    var instance = this;

    console.log(this);

    this.$refs.form.addEventListener('submit', function (e) {
      e.stopPropagation();
      e.preventDefault();
        });
    },
        
}

  </script>

<style lang="scss" scoped>
  @import "~@/styles/creditcardStyle.scss";
  </style>
