import * as areas from './areas';
import largeArea from '../testAssets/largeArea';
import correctAreaSize from '../testAssets/correctAreaSize';

describe ('checkArea', () => {
  it ('returns true when the area is within the size parameters', () => {
    expect(areas.checkArea(correctAreaSize)).toEqual(true);
  })

  it ('returns false when the area is greater than the defined max size', () => {
    expect(areas.checkArea(largeArea)).toEqual(false);
  })
})
