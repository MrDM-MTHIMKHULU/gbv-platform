// Run locally with: node ingest.js
// Not part of the deployed site, this is a one-off script you run whenever
// you add or update source documents.
//
// Setup: npm install @supabase/supabase-js dotenv
// .env needs: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ---------------------------------------------------------------------------
// 1. Define your source documents here.
//    Each entry becomes a labelled chunk in the knowledge base.
//    Start small and add more as you go, e.g. one entry per section of an Act.
// ---------------------------------------------------------------------------
const DOCUMENTS = [
  {
    source: 'Domestic Violence Act 116 of 1998, Section 1 (Definitions)',
    topic: 'Understanding Abuse',
    content: `1. Definitions and interpretation

(1) In this Act unless the context indicates otherwise—

"complainant" means any person who is or has been in a domestic relationship with a respondent and who is or has been subjected or allegedly subjected to an act of domestic violence, including any child in the care of the complainant;

"respondent" means any person who is or has been in a domestic relationship with a complainant and who has committed or allegedly committed, or has used or allegedly used a third party actor to commit or allegedly to commit, an act of domestic violence against the complainant;

"domestic relationship" means a relationship between a complainant and a respondent in any of the following ways: they are or were married to each other, including marriage according to any law, custom or religion; they (whether they are of the same or of the opposite sex) live or lived together in a relationship in the nature of marriage, although they are not, or were not, married to each other, or are not able to be married to each other; they are the parents of a child or are persons who have or had parental responsibility for that child (whether or not at the same time); they are family members related by consanguinity, affinity or adoption; they are or were in an engagement, dating or customary relationship, including an actual or perceived romantic, intimate or sexual relationship of any duration; or they are persons in a close relationship that share or shared the same residence.

"domestic violence" means physical abuse; sexual abuse; emotional, verbal or psychological abuse; economic abuse; intimidation; harassment; sexual harassment; related person abuse; spiritual abuse; damage to property; elder abuse; coercive behaviour; controlling behaviour; to expose a child to domestic violence; entry into the complainant's permanent or temporary residence without their consent, where the parties do not share the same residence, or workplace or place of study, without their consent, where the parties do not share the same workplace or place of study; or any other behaviour of an intimidating, threatening, abusive, degrading, offensive or humiliating nature towards a complainant, where such conduct harms, or inspires the reasonable belief that harm may be caused to the complainant.

"physical abuse" includes physical violence or threats of physical violence towards a complainant; to deprive the complainant of their liberty or threatening to do so; to administer, attempt to administer or threaten to administer any drug, scheduled substance, or chemical or other substance that is harmful to the health or wellbeing of the complainant, without the complainant's consent; or withholding or threatening to withhold a complainant's medication.

"sexual abuse" means any conduct that abuses, humiliates, degrades or otherwise violates the sexual integrity of the complainant, irrespective of whether or not such conduct constitutes a sexual offence as contemplated in the Criminal Law (Sexual Offences and Related Matters) Amendment Act, 2007.

"emotional, verbal or psychological abuse" means degrading, manipulating, threatening, offensive, intimidating or humiliating conduct towards a complainant that causes mental or psychological harm to a complainant, including insults, ridicule or name calling; threats to cause emotional pain; the exhibition of obsessive possessiveness or jealousy, which constitutes a serious invasion of the complainant's privacy, liberty, integrity or security; the wilful damaging or destruction of any property in close vicinity of a complainant; to harm or threaten to harm a household pet or other animal, whose welfare affects a complainant's well-being; to disclose or threaten to disclose a complainant's sexual orientation or other private information concerning a complainant, to others without the complainant's consent; to threaten the complainant with the death or injury of another person or damage of another person's property; or threats to commit suicide or self-harm.

"economic abuse" includes the deprivation of economic or financial resources to which a complainant is entitled under law or which the complainant requires out of necessity, including education expenses, household necessities for the complainant, and mortgage bond repayments or payment of rent in respect of the shared residence or accommodation; the disposal of household effects or other property in which the complainant has an interest without the complainant's permission; the use of financial resources of a complainant, without the complainant's permission; or the coercing of the complainant to relinquish control over assets or income, or sign a legal document that would enable the complainant's finances to be managed by another person.

"intimidation" means physical violence, or damage to property belonging to a complainant or any other person; threats of physical violence, or damage to property; to deprive the complainant or any other person of their liberty or threatening to do so; or conveying a threat, or causing a complainant to receive a threat, which induces fear of physical violence, or damage to property, through electronic communication, where such conduct is intended to compel a complainant to abstain from doing anything that they have a lawful right to do, or to do anything that they have a lawful right to abstain from doing.

"harassment" means the unreasonable following, watching, stalking, pursuing or accosting of the complainant or a related person; or loitering outside of or near the building or place where the complainant or a related person resides, works, carries on business, studies or happens to be, which inspires the belief in the complainant that they or a related person may be harmed or their property may be damaged; to repeatedly contact the complainant by means of an electronic communications service; the repeated sending or delivering of packages, communications or other objects to the complainant; the unauthorised access to a complainant's communication or electronic communication; the monitoring or tracking of the complainant's movements, activities or interpersonal associations without the complainant's consent, including by using technology; to enter any part of the joint residence that is exclusively used by the complainant without their permission; to unreasonably interfere with any property exclusively used by or in the possession of the complainant; or to disclose an electronic communication to or about the complainant which is abusive, degrading, offensive, humiliating, violates their sexual integrity or dignity, or inspires belief that harm may be caused.

"coercive behaviour" means to compel or force a complainant to abstain from doing anything that they have a lawful right to do, or to do anything that they have a lawful right to abstain from doing.

"controlling behaviour" means behaviour towards a complainant that has the effect of making the complainant dependent on, or subservient to the respondent and includes isolating them from sources of support; exploiting their resources or capacities for personal gain; depriving them of the means needed for independence, resistance or escape; or regulating their everyday behaviour.

"child" means a person under the age of 18 years.

"elder abuse" means abuse of an older person as contemplated in section 30(2) of the Older Persons Act, 2006, occurring within a domestic relationship.

"damage to property" means the wilful damaging or destruction of property, or threats to damage or destroy property, belonging to, or which is in the possession or under the control of, the complainant, or in which the complainant has a vested interest.

"spiritual abuse" means advocating hatred against the complainant because of their religious or spiritual beliefs, that constitutes incitement to cause harm to the complainant; preventing the complainant from exercising their constitutional right to freedom of conscience, religion, thought, belief and opinion; or manipulating the complainant's religious or spiritual convictions and beliefs to justify or rationalise abusing the complainant.

"sexual harassment" means unwelcome sexual attention from a respondent who knows or ought reasonably to know that such attention is unwelcome; unwelcome explicit or implicit behaviour, suggestions, gestures, remarks, communications, of a sexual nature or regarding the complainant's sexual orientation, gender or gender expression, that has the effect of offending, intimidating or humiliating the complainant; implied or expressed promise of reward if they comply with a sexually oriented request; or implied or expressed threat of reprisal for refusal to comply with a sexually oriented request.

"expose a child to domestic violence" means to intentionally cause a child to see or hear domestic violence, or experience the effects of domestic violence.`,
  },
  {
    source: 'Domestic Violence Act 116 of 1998, Section 2 (Duty of SAPS to assist and inform)',
    topic: 'Know Your Rights',
    content: `2. Duty to assist and inform complainant of rights

Any member of the South African Police Service must, at the scene of an incident of domestic violence or as soon thereafter as is reasonably possible, or when the incident of domestic violence is reported:

(a) render such assistance to the complainant as may be required in the circumstances, including assisting or making arrangements for the complainant to find a suitable shelter and to obtain medical treatment;

(b) if it is reasonably possible to do so, hand a notice containing information as prescribed to the complainant in the official language of the complainant's choice; and

(c) if it is reasonably possible to do so, explain to the complainant the content of such notice in the prescribed manner, including the remedies at their disposal in terms of this Act and the right to lodge a criminal complaint, if applicable.

3. Arrest by peace officer without warrant and assistance to complainant

A peace officer who attends the scene of an incident of domestic violence, may without a warrant, arrest any respondent who such peace officer reasonably suspects of having committed an act of domestic violence which constitutes an offence in terms of any law.

A peace officer must, without a warrant, arrest any respondent at the scene of an incident of domestic violence who they on reasonable grounds believe of having committed an act of domestic violence which constitutes an offence containing an element of violence against a complainant.

Where a protection order has not been issued against the respondent, a peace officer who is not a member of SAPS must, where necessary, make arrangements for the complainant to obtain medical attention; provide the complainant with a prescribed list containing the names and contact particulars of accessible shelters and public health establishments; and, if reasonably possible, hand and explain a notice of the complainant's rights and remedies under this Act.`,
  },
  {
    source: 'Domestic Violence Act 116 of 1998, Section 4 (Application for a Protection Order)',
    topic: 'Protection Orders',
    content: `4. Application for protection order

(1) Any complainant may, on an ex parte basis, in the prescribed form and manner, apply to the court for a protection order. The application must be lodged with the clerk of the court, or electronically by submitting the application to an electronic address of the court having jurisdiction. In the case of an urgent application outside ordinary court hours or on a day which is not an ordinary court day, the application may be submitted directly to the court.

(2) If the complainant is not represented by a legal representative, the clerk of the court must inform the complainant, in the prescribed manner, of the relief available in terms of this Act and the right to also lodge a criminal complaint against the respondent, if a criminal offence has been committed.

(3) Notwithstanding the provisions of any other law, the application for a protection order may be brought on behalf of the complainant by a functionary (such as a counsellor, health service provider, member of SAPS, social worker or teacher) or another person who has a material interest in the wellbeing of the complainant. This must be brought with the written consent of the complainant, except in circumstances where the complainant is a child and the court considers the application to be in the best interests of that child, or a person who, in the opinion of the court, is unable to provide the required consent.

(4) Notwithstanding the provisions of any other law, any child, or any person on behalf of a child, may apply to the court for a protection order without the consent or assistance of a parent, guardian or any other person.

(5) The application may be considered by the court, outside ordinary court hours or on a day which is not an ordinary court day, if the court is satisfied, from information provided in the application, that a reasonable belief exists that the complainant is suffering or may suffer harm, if the application is not dealt with immediately.

(6) Supporting affidavits by persons who have knowledge of the matter concerned may accompany the application.`,
  },
  {
    source: 'Domestic Violence Act 116 of 1998, Section 5 (Interim Protection Order)',
    topic: 'Protection Orders',
    content: `5. Consideration of application and issuing of interim protection order

(1) The court must as soon as is reasonably possible consider an application submitted to it, and may consider such additional evidence as it deems fit, including oral evidence or evidence by affidavit.

(2) If the court is satisfied that there is prima facie evidence that the respondent is committing, or has committed an act of domestic violence; the complainant is suffering or may suffer harm as a result of such domestic violence; and the issuing of a protection order is immediately necessary to protect the complainant against that harm, the court must, notwithstanding the fact that the respondent has not been given notice of the proceedings, issue an interim protection order in the prescribed form against the respondent.

(3) Upon the issuing of an interim protection order, the court must direct that certified copies of the application and any supporting affidavit, the record of any evidence, and the original interim protection order be served on the respondent in the prescribed manner by the clerk of the court, sheriff or peace officer identified by the court. An interim protection order must call on the respondent to show cause on the return date specified in the order why the interim protection order should not be made final.

(4) If the court does not issue an interim protection order, the court must direct the clerk of the court to cause certified copies of the application and any supporting affidavits to be served on the respondent, together with a prescribed notice calling on the respondent to show cause on the return date why a protection order should not be issued.

(5) The return date may not be less than 10 days after service has been effected upon the respondent, and may be anticipated by the respondent upon not less than 24 hours' written notice to the complainant and the court.

(6) An interim protection order is of force and effect from the time that the existence and content of the order have been served on the respondent, and it remains in force until it is set aside by a competent court.`,
  },
  {
    source: 'Domestic Violence Act 116 of 1998, Section 6 (Final Protection Order)',
    topic: 'Protection Orders',
    content: `6. Issuing of final protection order

(1) If the respondent does not appear on the return date, and the court is satisfied that proper service has been effected on the respondent and that the application contains prima facie evidence that the respondent has committed or is committing an act of domestic violence, the court must issue a final protection order in the prescribed form.

(2) If the respondent appears on the return date in order to oppose the issuing of a protection order, the court must proceed to hear the matter, considering any evidence previously received and any further affidavits or oral evidence. If there is a dispute of fact, the court may adjourn the proceedings to allow the party concerned the opportunity to adduce further evidence, and must extend the interim protection order in the meantime.

(4) The court must, after a hearing, issue a final protection order in the prescribed form if it finds, on a balance of probabilities, that the respondent has committed or is committing an act of domestic violence.

(5) On the issuing of a final protection order the court must direct that the original of such order be served on the respondent within 48 hours or as soon as reasonably possible, and that a certified copy of the order, and the original warrant of arrest, be served on the complainant.

(7) A final protection order is of force and effect from the time that the existence and content of the order have been served on the respondent, and remains in force until it is set aside; the execution of such order is not automatically suspended upon the noting of an appeal.`,
  },
  {
    source: 'Domestic Violence Act 116 of 1998, Section 7 (Court\u2019s Powers in Respect of a Protection Order)',
    topic: 'Protection Orders',
    content: `7. Court's powers in respect of protection order

(1) The court may, by means of a protection order, prohibit the respondent from committing or attempting to commit any act of domestic violence; enlisting the help of another person to commit any such act; entering a residence shared by the complainant and the respondent (only if it appears to be in the best interests of the complainant); entering a specified part of such a shared residence; entering the complainant's residence; entering the complainant's workplace or place of studies; preventing the complainant from entering or remaining in the shared residence or a specified part of it; disclosing any electronic communication or making available any communication as specified in the order; or committing any other act as specified in the protection order.

(2) The court may impose any additional conditions which it deems reasonably necessary to protect and provide for the safety, health or wellbeing of the complainant, including an order to seize any weapon in the possession or under the control of the respondent, that a peace officer must accompany the complainant to collect personal property, or a recommendation that the complainant approach the relevant police station to institute a criminal prosecution against the respondent.

(4) The court may order the respondent to pay emergency monetary relief having regard to the financial needs and resources of the complainant and the respondent, and such order has the effect of a civil judgment of a magistrate's court.

(5) The physical, home, study and work address and contact details of the complainant must be omitted from the protection order, unless the nature of the terms of the order necessitates their inclusion. The court may issue any directions to ensure the complainant's address and contact details are not disclosed in any manner which may endanger their safety, health or wellbeing.

(6) If the court is satisfied that it is in the best interests of any child it may refuse the respondent contact with such child, or order contact with such child on such conditions as it may consider appropriate.

(7) The court may not refuse to issue a protection order, or to impose any condition or make any order it is competent to make, merely on the grounds that other legal remedies are available to the complainant.`,
  },
  {
    source: 'Domestic Violence Act 116 of 1998, Section 8 (Warrant of Arrest)',
    topic: 'Protection Orders',
    content: `8. Warrant of arrest upon issuing of protection order

(1) Whenever a court issues a protection order, the court must make an order authorising the issue of a warrant for the arrest of the respondent, in the prescribed form, and suspending the execution of such warrant subject to compliance with any prohibition, condition, obligation or order imposed in terms of section 7.

(2) The warrant remains in force unless the protection order is set aside, or it is cancelled after execution.

(3) The clerk of the court must issue the complainant with a second or further warrant of arrest, if the complainant files an affidavit stating that such warrant is required for their protection and that the existing warrant has been executed and cancelled, or lost or destroyed.

(4) A complainant may hand the warrant of arrest together with an affidavit stating that the respondent has contravened any prohibition, condition, obligation or order contained in a protection order, to any member of SAPS. If it appears to the member that there are reasonable grounds to suspect that the complainant is suffering or may suffer harm as a result of the alleged breach, the member must immediately arrest the respondent. If the member is of the opinion that there are insufficient grounds for arrest, the member must immediately hand a written notice to the respondent calling on them to appear before a court on a charge of committing the offence of breaching a protection order.

(6) Whenever a warrant of arrest is handed to a member of SAPS, the member must inform the complainant of their right to simultaneously lay a criminal charge against the respondent, if applicable, and explain to the complainant how to lay such a charge.

17. Offences

Any person who contravenes any prohibition, condition, obligation or order imposed in terms of a protection order is guilty of an offence and liable on conviction: if it is a first conviction, to a fine or imprisonment for a period not exceeding five years, or both; if it is a second or subsequent conviction, to a fine or imprisonment for a period not exceeding ten years.`,
  },
  // Once these are working, come back and add Sexual Offences Act sections,
  // Legal Aid guides, and shelter directory info the same way.
];

// ---------------------------------------------------------------------------
// 2. Simple chunking: splits long content into ~500-word pieces.
//    Adjust chunkSize if a section is very long or very short.
// ---------------------------------------------------------------------------
function chunkText(text, chunkSize = 500) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}

async function embed(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text }] },
      }),
    }
  );
  const data = await res.json();
  return data.embedding?.values;
}

async function run() {
  for (const doc of DOCUMENTS) {
    const chunks = chunkText(doc.content);
    console.log(`Embedding ${chunks.length} chunk(s) from: ${doc.source}`);

    for (const chunk of chunks) {
      const embedding = await embed(chunk);
      if (!embedding) {
        console.error(`Failed to embed a chunk from ${doc.source}, skipping.`);
        continue;
      }

      const { error } = await supabase.from('document_chunks').insert({
        content: chunk,
        source: doc.source,
        topic: doc.topic,
        embedding,
      });

      if (error) console.error('Insert error:', error);
    }
  }

  console.log('Done.');
}

run();
