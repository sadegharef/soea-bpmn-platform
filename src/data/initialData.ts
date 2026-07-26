/**
 * @file initialData.ts
 * @description داده‌های اولیه و نمونه برای کاربران، تیم‌ها، پوشه‌ها و فرآیندهای BPMN 2.0 در فضای کاری
 */

import { User, Team, Folder, Diagram, TagItem } from '../types';

/**
 * بانک تگ‌های پیش‌فرض اولیه
 */
export const INITIAL_TAG_BANK: TagItem[] = [
  { id: 'tag_1', name: 'اولویت بالا', color: '#ef4444' },
  { id: 'tag_2', name: 'اولویت متوسط', color: '#f59e0b' },
  { id: 'tag_3', name: 'اولویت پایین', color: '#10b981' },
  { id: 'tag_4', name: 'مالی', color: '#3b82f6' },
  { id: 'tag_5', name: 'منابع انسانی', color: '#a855f7' },
  { id: 'tag_6', name: 'خزانه', color: '#0284c7' },
  { id: 'tag_7', name: 'جذب', color: '#ec4899' },
  { id: 'tag_8', name: 'As-Is', color: '#64748b' },
  { id: 'tag_9', name: 'To-Be', color: '#06b6d4' },
];

/**
 * کاربران نمونه اولیه سامانه
 */
export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'علی رضایی',
    nameEn: 'Ali Rezaei',
    username: 'ali.rezaei',
    password: '123',
    email: 'ali.rezaei@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'مدیر ارشد معماری فرآیند',
  },
  {
    id: 'u2',
    name: 'مریم احمدی',
    nameEn: 'Maryam Ahmadi',
    username: 'm.ahmadi',
    password: '123',
    email: 'm.ahmadi@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'بازبین ارشد کیفیت',
  },
  {
    id: 'u3',
    name: 'سارا حسینی',
    nameEn: 'Sara Hosseini',
    username: 'sara.h',
    password: '123',
    email: 'sara.h@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'تحلیل‌گر و طراح فرآیند',
  },
  {
    id: 'u4',
    name: 'رضا محمدی',
    nameEn: 'Reza Mohammadi',
    username: 'reza.m',
    password: '123',
    email: 'reza.m@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'کارشناس ناظر ذینفعان',
  },
];

/**
 * تیم‌های سازمانی اولیه
 */
export const INITIAL_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'تیم معماری و بهینه‌سازی فرآیندها',
    nameEn: 'Process Architecture Team',
    description: 'مدیریت و مهندسی مجدد فرآیندهای کسب‌وکار سازمانی',
    ownerId: 'u1',
    createdAt: '2025-01-10',
    members: [
      { userId: 'u1', user: INITIAL_USERS[0], role: 'manager', joinedAt: '2025-01-10' },
      { userId: 'u2', user: INITIAL_USERS[1], role: 'reviewer', joinedAt: '2025-01-12' },
      { userId: 'u3', user: INITIAL_USERS[2], role: 'editor', joinedAt: '2025-01-15' },
      { userId: 'u4', user: INITIAL_USERS[3], role: 'viewer', joinedAt: '2025-01-20' },
    ],
  },
  {
    id: 't2',
    name: 'واحد تضمین کیفیت و بازبینی داخلی',
    nameEn: 'Quality Assurance Unit',
    description: 'نظارت بر تطابق فرآیندها با استانداردهای ایزو و حکمرانی داده',
    ownerId: 'u2',
    createdAt: '2025-02-01',
    members: [
      { userId: 'u2', user: INITIAL_USERS[1], role: 'manager', joinedAt: '2025-02-01' },
      { userId: 'u1', user: INITIAL_USERS[0], role: 'editor', joinedAt: '2025-02-02' },
    ],
  },
];

/**
 * پوشه‌های ساختاری اولیه
 */
export const INITIAL_FOLDERS: Folder[] = [
  { id: 'f1', name: 'فرآیندهای مالی و حسابداری', teamId: 't1', parentId: null, createdAt: '2025-01-11' },
  { id: 'f2', name: 'مدیریت منابع انسانی و جذب', teamId: 't1', parentId: null, createdAt: '2025-01-12' },
  { id: 'f3', name: 'خزانه و پرداخت تامین‌کنندگان', teamId: 't1', parentId: 'f1', createdAt: '2025-01-14' },
];

/**
 * فرآیند نمونه اولیه با ساختار استاندارد BPMN 2.0 XML
 */
export const DEMO_BPMN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Proc_VendorPayment" name="فرآیند تسویه حساب و پرداخت به تامین‌کنندگان" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="دریافت فاکتور">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:userTask id="Task_CheckInvoice" name="تطبیق فاکتور و رسید انبار">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:exclusiveGateway id="Gateway_Approval" name="تایید حسابداری؟">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_Approved</bpmn:outgoing>
      <bpmn:outgoing>Flow_Rejected</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:serviceTask id="Task_TransferMoney" name="پرداخت الکترونیک از خزانه">
      <bpmn:incoming>Flow_Approved</bpmn:incoming>
      <bpmn:outgoing>Flow_EndApproved</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:userTask id="Task_RejectNotice" name="اعلام اصلاحیه به تامین‌کننده">
      <bpmn:incoming>Flow_Rejected</bpmn:incoming>
      <bpmn:outgoing>Flow_EndRejected</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:endEvent id="EndEvent_Success" name="خاتمه موفق تسویه">
      <bpmn:incoming>Flow_EndApproved</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:endEvent id="EndEvent_Rejected" name="عودت فاکتور">
      <bpmn:incoming>Flow_EndRejected</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_CheckInvoice" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_CheckInvoice" targetRef="Gateway_Approval" />
    <bpmn:sequenceFlow id="Flow_Approved" name="بله" sourceRef="Gateway_Approval" targetRef="Task_TransferMoney" />
    <bpmn:sequenceFlow id="Flow_Rejected" name="خیر" sourceRef="Gateway_Approval" targetRef="Task_RejectNotice" />
    <bpmn:sequenceFlow id="Flow_EndApproved" sourceRef="Task_TransferMoney" targetRef="EndEvent_Success" />
    <bpmn:sequenceFlow id="Flow_EndRejected" sourceRef="Task_RejectNotice" targetRef="EndEvent_Rejected" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Proc_VendorPayment">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="138" y="145" width="65" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_CheckInvoice_di" bpmnElement="Task_CheckInvoice">
        <dc:Bounds x="240" y="80" width="120" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_Approval_di" bpmnElement="Gateway_Approval" isMarkerVisible="true">
        <dc:Bounds x="415" y="95" width="50" height="50" />
        <bpmndi:BPMNLabel><dc:Bounds x="403" y="65" width="75" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_TransferMoney_di" bpmnElement="Task_TransferMoney">
        <dc:Bounds x="520" y="80" width="120" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_RejectNotice_di" bpmnElement="Task_RejectNotice">
        <dc:Bounds x="520" y="200" width="120" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_Success_di" bpmnElement="EndEvent_Success">
        <dc:Bounds x="692" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="668" y="145" width="85" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_Rejected_di" bpmnElement="EndEvent_Rejected">
        <dc:Bounds x="692" y="222" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="682" y="265" width="56" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1"><di:waypoint x="188" y="120" /><di:waypoint x="240" y="120" /></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2"><di:waypoint x="360" y="120" /><di:waypoint x="415" y="120" /></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Approved_di" bpmnElement="Flow_Approved"><di:waypoint x="465" y="120" /><di:waypoint x="520" y="120" /></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Rejected_di" bpmnElement="Flow_Rejected"><di:waypoint x="440" y="145" /><di:waypoint x="440" y="240" /><di:waypoint x="520" y="240" /></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_EndApproved_di" bpmnElement="Flow_EndApproved"><di:waypoint x="640" y="120" /><di:waypoint x="692" y="120" /></bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_EndRejected_di" bpmnElement="Flow_EndRejected"><di:waypoint x="640" y="240" /><di:waypoint x="692" y="240" /></bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

/**
 * دیاگرام‌های اولیه نمونه
 */
export const INITIAL_DIAGRAMS: Diagram[] = [
  {
    id: 'd1',
    title: 'فرآیند تسویه حساب و پرداخت به تامین‌کنندگان',
    titleEn: 'Vendor Invoice Settlement & Payment Process',
    description: 'فرآیند جامع تایید فاکتور، مطابقت با انبار و صدور حواله الکترونیکی',
    teamId: 't1',
    folderId: 'f3',
    status: 'in_review',
    tags: ['اولویت بالا', 'مالی', 'خزانه', 'As-Is'],
    reviewerId: 'u2',
    reviewerName: 'مریم احمدی',
    contributorIds: ['u1', 'u3'],
    contributors: [
      { userId: 'u1', name: 'علی رضایی', avatar: INITIAL_USERS[0].avatar, action: 'تکمیل ساختار اولیه بوم', timestamp: '2025-02-10 14:30' },
      { userId: 'u3', name: 'سارا حسینی', avatar: INITIAL_USERS[2].avatar, action: 'اضافه نمودن درگاه‌های تصمیمی', timestamp: '2025-02-12 10:15' }
    ],
    createdAt: '2025-02-10',
    updatedAt: '2025-02-12 10:15',
    latestVersion: 2,
    xml: DEMO_BPMN_XML,
    versions: [
      {
        version: 2,
        xml: DEMO_BPMN_XML,
        timestamp: '2025-02-12 10:15',
        editorId: 'u3',
        editorName: 'سارا حسینی',
        changeSummary: 'افزودن رویداد مرزی خطا و انصراف'
      },
      {
        version: 1,
        xml: DEMO_BPMN_XML,
        timestamp: '2025-02-10 14:30',
        editorId: 'u1',
        editorName: 'علی رضایی',
        changeSummary: 'ایجاد نسخه اولیه فرآیند'
      }
    ],
    comments: [
      {
        id: 'c1',
        userId: 'u2',
        userName: 'مریم احمدی',
        userAvatar: INITIAL_USERS[1].avatar,
        content: 'لطفاً زمان‌سنج رویداد میانی پرداخت نیز چک شود.',
        timestamp: '2025-02-12 11:00',
        status: 'open'
      }
    ]
  },
  {
    id: 'd2',
    title: 'فرآیند جذب و استخدام سرمایه‌های انسانی',
    titleEn: 'Employee Recruitment & Onboarding Process',
    description: 'مراحل غربالگری رزومه‌ها، مصاحبه‌های تخصصی و صدور پیشنهاد همکاری',
    teamId: 't1',
    folderId: 'f2',
    status: 'approved',
    tags: ['منابع انسانی', 'جذب', 'اولویت متوسط', 'To-Be'],
    reviewerId: 'u2',
    reviewerName: 'مریم احمدی',
    contributorIds: ['u1'],
    contributors: [
      { userId: 'u1', name: 'علی رضایی', avatar: INITIAL_USERS[0].avatar, action: 'تصویب و تایید نهایی', timestamp: '2025-01-25 09:00' }
    ],
    createdAt: '2025-01-20',
    updatedAt: '2025-01-25 09:00',
    latestVersion: 1,
    xml: DEMO_BPMN_XML,
    versions: [
      {
        version: 1,
        xml: DEMO_BPMN_XML,
        timestamp: '2025-01-25 09:00',
        editorId: 'u1',
        editorName: 'علی رضایی',
        changeSummary: 'تصویب نسخه نهایی استاندارد'
      }
    ]
  }
];
