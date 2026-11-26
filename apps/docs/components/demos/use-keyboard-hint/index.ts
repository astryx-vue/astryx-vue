import { defineDemo } from '../../demo-infra/defineDemo'
import starRatingDemo from './star-rating.vue'
import starRatingSource from './star-rating.vue?raw&highlighted'

export const useKeyboardHintStarRating = defineDemo(starRatingDemo, starRatingSource)
