import Theme from '../theme';
import { defaultsMixin } from '../defaults';
import { isObject, isDate } from '../tool';
import Locale from '../locale';

export const rootMixin = {
  mixins: [defaultsMixin],
  props: {
    color: String,
    isDark: Boolean,
    firstDayOfWeek: Number,
    masks: Object,
    locale: [String, Object],
    timezone: String,
    minDate: null,
    maxDate: null,
    minDateExact: null,
    maxDateExact: null,
    disabledDates: null,
    availableDates: null,
    theme: null,
  },
  computed: {
    $theme() {
      // 如果返回的主题实例，则返回用户自定义主题实例
      if (this.theme instanceof Theme) return this.theme;
      // 否则生成自定义主题
      return new Theme({
        color: this.passedProp('color', 'blue'),
        isDark: this.passedProp('isDark', false),
      });
    },
    $locale() {
      // 如果是locale类的实例，则返回locale
      if (this.locale instanceof Locale) return this.locale;
      // 从组件的props里构建基本配置
      const config = isObject(this.locale)
        ? this.locale
        : {
          id: this.locale,
          firstDayOfWeek: this.firstDayOfWeek,
          masks: this.masks,
        };
      // 重新构建
      return new Locale(config, {
        locales: this.$locales,
        timezone: this.timezone,
      });
    },
    // disabledDates_() {
    //   const dates = this.normalizeDates(this.disabledDates);
    //   const { minDate, minDateExact, maxDate, maxDateExact } = this;
    //   // Add disabled range for min date
    //   if (minDateExact || minDate) {
    //     const end = minDateExact
    //       ? this.normalizeDate(minDateExact)
    //       : this.normalizeDate(minDate, { time: '00:00:00' });
    //     dates.push({
    //       start: null,
    //       end: new Date(end.getTime() - 1000),
    //     });
    //   }
    //   // Add disabled range for min date
    //   if (maxDateExact || maxDate) {
    //     const start = maxDateExact
    //       ? this.normalizeDate(maxDateExact)
    //       : this.normalizeDate(maxDate, { time: '23:59:59' });
    //     dates.push({
    //       start: new Date(start.getTime() + 1000),
    //       end: null,
    //     });
    //   }
    //   return dates;
    // },
    // availableDates_() {
    //   return this.normalizeDates(this.availableDates);
    // },
    // disabledAttribute() {
    //   return new Attribute(
    //     {
    //       key: 'disabled',
    //       dates: this.disabledDates_,
    //       excludeDates: this.availableDates_,
    //       excludeMode: 'includes',
    //       order: 100,
    //     },
    //     this.$theme,
    //     this.$locale,
    //   );
    // },
  },
  created() {
    // setupScreens(this.$defaults.screens);
  },
  methods: {
    formatDate(date, mask) {
      return this.$locale ? this.$locale.format(date, mask) : '';
    },
    parseDate(text, mask) {
      if (!this.$locale) return null;
      const value = this.$locale.parse(text, mask);
      return isDate(value) ? value : null;
    },
    normalizeDate(date, config) {
      return this.$locale ? this.$locale.normalizeDate(date, config) : date;
    },
    normalizeDates(dates) {
      return this.$locale.normalizeDates(dates, {
        isFullDay: true,
      });
    },
    pageForDate(date) {
      return this.$locale.getDateParts(this.normalizeDate(date));
    },
    pageForThisMonth() {
      return this.pageForDate(new Date());
    },
  },
};
