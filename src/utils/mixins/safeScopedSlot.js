import _ from 'lodash';

export const safeScopedSlotMixin = {
  methods: {
    safeScopedSlot(name, args, def = null) {
      return _.isFunction(this.$scopedSlots[name])
        ? this.$scopedSlots[name](args)
        : def;
    },
  },
};
