export interface Member {
    sid: string;
    name: string;
    major: string;
    grade: string;
    role : string;
    joinDate: string;
  }
export interface applicationMember {
  index:number;
  sid: string;
  name: string;
  major: string;
  grade: string;
  status: "Hold" | "APPROVE" | "REJECT"
  role : string;
  joinDate: string;
}

