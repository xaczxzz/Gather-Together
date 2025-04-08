//export는 필수

export interface Attendance {
    index: number;
    sid: string;
    name: string;
    date: string;
    major: string;
    grade: string;
    status: 'PRESENT' | 'ABSENT' ;
  }