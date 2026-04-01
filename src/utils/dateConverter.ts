import NepaliDate from 'nepali-date-converter';

export const convertADToBS = (adDate: Date | string): string => {
  const date = typeof adDate === 'string' ? new Date(adDate) : adDate;
  const nepaliDate = new NepaliDate(date);
  return nepaliDate.format('YYYY-MM-DD');
};

export const convertBSToAD = (bsDate: string): Date => {
  const parts = bsDate.split('-');
  if (parts.length !== 3) {
    throw new Error('Invalid BS date format. Expected YYYY-MM-DD');
  }
  const [year, month, day] = parts.map(Number);
  const nepaliDate = new NepaliDate(year, month - 1, day);
  return nepaliDate.toJsDate();
};

export const formatBSDate = (bsDate: string): string => {
  const parts = bsDate.split('-');
  if (parts.length !== 3) {
    return bsDate;
  }
  const [year, month, day] = parts.map(Number);

  const monthNames = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];

  const nepaliDate = new NepaliDate(year, month - 1, day);
  return `${monthNames[nepaliDate.getMonth()]} ${day}, ${year}`;
};

export const getTodayBS = (): string => {
  return convertADToBS(new Date());
};

export const getCurrentMonthBS = (): { year: number; month: number } => {
  const today = new Date();
  const nepaliDate = new NepaliDate(today);
  return {
    year: nepaliDate.getYear(),
    month: nepaliDate.getMonth() + 1,
  };
};

export const getMonthRangeBS = (year: number, month: number): { start: string; end: string } => {
  const nepaliDate = new NepaliDate(year, month - 1, 1);
  const start = nepaliDate.format('YYYY-MM-DD');
  nepaliDate.setMonth(nepaliDate.getMonth() + 1);
  nepaliDate.setDate(0);
  const end = nepaliDate.format('YYYY-MM-DD');
  return { start, end };
};
