import { Test, TestingModule } from '@nestjs/testing';
import { IcsService } from './ics.service';

const content = {
  title: 'Säger med',
  startTime: '2023-03-30T14:30:00.000Z',
  endTime: '2023-03-30T17:30:00.000Z',
  location: {
    address: 'Slottsbacken 8',
    postalCode: '11130',
    city: 'Stockholm',
  },
};

describe('IcsService', () => {
  let service: IcsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IcsService],
    }).compile();

    service = module.get<IcsService>(IcsService);
  });

  describe('icsService', () => {
    describe('getTimesArray', () => {
      it('should parse a date string into DateArray [year, month, day, hours, minutes]', () => {
        const r = service.getTimesArray('2023-03-29T14:07:00.000Z');
        expect(r).toStrictEqual([2023, 3, 29, 14, 7]);
      });
      it('should parse a date string into DateArray ', () => {
        const r = service.getTimesArray('2023-12-31T00:00:00.000Z');
        expect(r).toStrictEqual([2023, 12, 31, 0, 0]);
      });
    });

    describe('parseContentToEvent', () => {
      const result = {
        start: [2023, 3, 30, 14, 30],
        end: [2023, 3, 30, 17, 30],
        title: 'Säger med',
        description: 'Your booking',
        location: 'Slottsbacken 8, 11130, Stockholm',
      };
      it('should parse the workspace details', () => {
        const event = service.parseContentToEvent(content);

        expect(event).toStrictEqual(result);
      });
    });

    describe('createIcs', () => {
      it('should return a valid ics content', () => {
        const { ics } = service.createIcsResponse(content);

        expect(typeof ics).toBe('string');
        expect(ics.length).toBeGreaterThan(100);
        expect(ics).toContain('DESCRIPTION:Your booking');
      });
      it('error when ics not created', () => {
        const { ics, error } = service.createIcsResponse({
          ...content,
          endTime: '',
        });

        expect(ics).toBe(undefined);
        expect(error['errors'].length).toBe(5);
      });
    });
  });
});
