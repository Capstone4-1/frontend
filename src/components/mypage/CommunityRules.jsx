import React from "react";
import "./CommunityRules.css";

const CommunityRules = () => {
  return (
    <div className="CommunityRules" aria-labelledby="rules-heading">
      <h3 id="rules-heading" className="rules-title">커뮤니티 이용규칙</h3>

      <div className="rules-card">
        <section className="rule-section">
          <h4>1. 목적</h4>
          <p>
            본 이용규칙은 모두가 안전하고 즐겁게 참여할 수 있는 커뮤니티 환경을 만들기 위한
            최소한의 약속입니다. 아래 규칙은 서비스 전체(게시글, 댓글, 프로필 등)에 동일하게 적용됩니다.
          </p>
        </section>

        <section className="rule-section">
          <h4>2. 기본 원칙</h4>
          <ul className="rule-list">
            <li>타인을 존중하고, 예의를 지킵니다.</li>
            <li>사실에 근거한 책임 있는 표현을 사용합니다.</li>
            <li>규칙을 지키지 않을 경우 제재가 적용될 수 있습니다.</li>
          </ul>
        </section>

        <section className="rule-section">
          <h4>3. 금지되는 행위</h4>
          <ul className="rule-list">
            <li><strong>혐오/차별/비하 표현</strong> 및 괴롭힘(개인 공격, 따돌림, 협박 등)</li>
            <li><strong>스팸</strong>, 도배, 무관한 광고·홍보, 반복적인 동일 게시</li>
            <li><strong>불법 정보</strong> 유통, 타인의 <strong>개인정보</strong> 노출/수집/공유</li>
            <li>성적 수치심을 유발하는 <strong>음란물</strong> 또는 미성년자 유해 콘텐츠</li>
            <li>저작권, 상표권 등 <strong>지식재산권</strong> 침해(무단 복제/배포)</li>
            <li>악성코드, 피싱, 사기 등 보안 위협 행위</li>
          </ul>
        </section>

        <section className="rule-section">
          <h4>4. 게시물 운영 기준</h4>
          <ul className="rule-list">
            <li>제목/본문은 <strong>주제와 관련</strong> 있게 작성해 주세요.</li>
            <li>출처가 있는 자료는 <strong>명확한 출처</strong>를 표시해 주세요.</li>
            <li>광고/홍보는 운영정책이 허용한 범위에서만 가능합니다.</li>
            <li>같은 내용을 반복 게시하면 숨김·삭제 대상이 될 수 있습니다.</li>
            <li>외부 링크는 <strong>안전한 링크</strong>만 공유해 주세요.</li>
          </ul>
        </section>

        <section className="rule-section">
          <h4>5. 제재 기준</h4>
          <ul className="rule-list">
            <li>사안의 경중과 누적 여부에 따라 <strong>경고 → 일정 기간 제한 → 영구 이용정지</strong>가 적용됩니다.</li>
            <li>법령 위반이 의심되는 경우 관련 기관에 협조할 수 있습니다.</li>
          </ul>
        </section>

        <section className="rule-section">
          <h4>6. 신고 및 이의제기</h4>
          <ul className="rule-list">
            <li>규칙 위반 게시물은 <strong>신고 기능</strong>으로 알려 주세요.</li>
            <li>제재에 대한 이의는 공지된 절차에 따라 <strong>문의</strong>로 접수할 수 있습니다.</li>
          </ul>
        </section>

        <section className="rule-section">
          <h4>7. 개인정보 및 보안</h4>
          <ul className="rule-list">
            <li>본인의 계정·비밀번호는 <strong>안전하게</strong> 관리해 주세요.</li>
            <li>타인의 정보를 수집/공개하는 행위는 금지됩니다.</li>
          </ul>
        </section>

        <section className="rule-section">
          <h4>8. 기타</h4>
          <p>
            본 규칙은 서비스 개선을 위해 <strong>사전 공지 후 변경</strong>될 수 있습니다.
            변경사항은 공지 이후 효력이 발생합니다.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CommunityRules;
