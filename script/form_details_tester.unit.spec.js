const chai = require('chai');
const fetch = require('node-fetch');
const yaml = require('js-yaml');

const redirectConfig = yaml.safeLoad(`
src: ^/vaforms/form_detail.asp$
dest: /find-forms/
matcher: '~*'
redirects_by_query:
  - param_name: "formno"
    param_value: ^21-0958$
    dest: /decision-reviews/legacy-appeals/#a-legacy-appeal-follows-these-
  # October 8th, 2020: https://github.com/department-of-veterans-affairs/va.gov-team/issues/5549
  - param_name: "formno"
    param_value: ^21-4138$
    dest: /find-forms/about-form-21-4138/
  - param_name: "formno"
    param_value: ^21-526ez$
    dest: /find-forms/about-form-21-526ez/
  - param_name: "formno"
    param_value: ^180$
    dest: /records/get-military-service-records/
  - param_name: "formno"
    param_value: ^21-2680$
    dest: /find-forms/about-form-21-2680/
  - param_name: "formno"
    param_value: ^22-1995$
    dest: /find-forms/about-form-22-1995/
  - param_name: "formno"
    param_value: ^21-22$
    dest: /find-forms/about-form-21-22/
  - param_name: "formno"
    param_value: ^7959c$
    dest: /find-forms/about-form-10-7959c/
  - param_name: "formno"
    param_value: ^10d$
    dest: /find-forms/about-form-10-10d/
  - param_name: "formno"
    param_value: ^5345$
    dest: /find-forms/about-form-10-5345/
  - param_name: "formno"
    param_value: ^21-686c$
    dest: /find-forms/about-form-21-686c/
  - param_name: "formno"
    param_value: ^20-0995$
    dest: /find-forms/about-form-20-0995/
  - param_name: "formno"
    param_value: ^0137$
    dest: /find-forms/about-form-10-0137/
  - param_name: "formno"
    param_value: ^21-0966$
    dest: /find-forms/about-form-21-0966/
  - param_name: "formno"
    param_value: ^21-0781$
    dest: /find-forms/about-form-21-0781/
  - param_name: "formno"
    param_value: ^21-0845$
    dest: /find-forms/about-form-21-0845/
  - param_name: "formno"
    param_value: ^22-5490$
    dest: /find-forms/about-form-22-5490/
  - param_name: "formno"
    param_value: ^21p-534ez$
    dest: /find-forms/about-form-21p-534ez/
  - param_name: "formno"
    param_value: ^21-4142$
    dest: /find-forms/about-form-21-4142/
  - param_name: "formno"
    param_value: ^26-1880$
    dest: /find-forms/about-form-26-1880/
  - param_name: "formno"
    param_value: ^2850c$
    dest: /find-forms/about-form-10-2850c/
  - param_name: "formno"
    param_value: ^306$
    dest: https://www.opm.gov/forms
  - param_name: "formno"
    param_value: ^10ez$
    dest: /find-forms/about-form-10-10ez/
  - param_name: "formno"
    param_value: ^21p-0969$
    dest: /find-forms/about-form-21p-0969/
  - param_name: "formno"
    param_value: ^21-674$
    dest: /find-forms/about-form-21-674/
  - param_name: "formno"
    param_value: ^21-8940$
    dest: /find-forms/about-form-21-8940/
  - param_name: "formno"
    param_value: ^3542$
    dest: /find-forms/about-form-10-3542/
  - param_name: "formno"
    param_value: ^20-572$
    dest: /find-forms/about-form-20-572/
  - param_name: "formno"
    param_value: ^7959a$
    dest: /find-forms/about-form-10-7959a/
  - param_name: "formno"
    param_value: ^22-1990$
    dest: /find-forms/about-form-22-1990/
  - param_name: "formno"
    param_value: ^10cg$
    dest: /find-forms/about-form-10-10cg/
  - param_name: "formno"
    param_value: ^21p-527ez$
    dest: /find-forms/about-form-21p-527ez/
  - param_name: "formno"
    param_value: ^5655$
    dest: /find-forms/about-form-5655/
  - param_name: "formno"
    param_value: ^8678$
    dest: /find-forms/about-form-10-8678/
  - param_name: "formno"
    param_value: ^21-4192$
    dest: /find-forms/about-form-21-4192/
  - param_name: "formno"
    param_value: ^20-0996$
    dest: /find-forms/about-form-20-0996/
  - param_name: "formno"
    param_value: ^21-0788$
    dest: /find-forms/about-form-21-0788/
  - param_name: "formno"
    param_value: ^21p-530$
    dest: /find-forms/about-form-21p-530/
  - param_name: "formno"
    param_value: ^26-8923$
    dest: /find-forms/about-form-26-8923/
  - param_name: "formno"
    param_value: ^22-5495$
    dest: /find-forms/about-form-22-5495/
  - param_name: "formno"
    param_value: ^26-8937$
    dest: /find-forms/about-form-26-8937/
  - param_name: "formno"
    param_value: ^22-1990e$
    dest: /find-forms/about-form-22-1990e/
  - param_name: "formno"
    param_value: ^21-4142a$
    dest: /find-forms/about-form-21-4142a/
  - param_name: "formno"
    param_value: ^21-22a$
    dest: /find-forms/about-form-21-22a/
  - param_name: "formno"
    param_value: ^21-8951-2$
    dest: /find-forms/about-form-21-8951-2/
  - param_name: "formno"
    param_value: ^28-1900$
    dest: /find-forms/about-form-28-1900/
  - param_name: "formno"
    param_value: ^26-1820$
    dest: /find-forms/about-form-26-1820/
  - param_name: "formno"
    param_value: ^21-0779$
    dest: /find-forms/about-form-21-0779/
  - param_name: "formno"
    param_value: ^26-1859$
    dest: /find-forms/about-form-26-1859/
  - param_name: "formno"
    param_value: ^27-2008$
    dest: /find-forms/about-form-27-2008/
  - param_name: "formno"
    param_value: ^21-0781a$
    dest: /find-forms/about-form-21-0781a/
  - param_name: "formno"
    param_value: ^10091$
    dest: /find-forms/about-form-10091/
  - param_name: "formno"
    param_value: ^10182$
    dest: /find-forms/about-form-10182/
  - param_name: "formno"
    param_value: ^21-0538$
    dest: /find-forms/about-form-21-0538/
  - param_name: "formno"
    param_value: ^7959f-1$
    dest: /find-forms/about-form-10-7959f-1/
  - param_name: "formno"
    param_value: ^3288$
    dest: /find-forms/about-form-3288/
  - param_name: "formno"
    param_value: ^26-6381$
    dest: /find-forms/about-form-26-6381/
  - param_name: "formno"
    param_value: ^26-1802a$
    dest: /find-forms/about-form-26-1802a/
  - param_name: "formno"
    param_value: ^22-6553d-1$
    dest: /find-forms/about-form-22-6553d-1/
  - param_name: "formno"
    param_value: ^2850a$
    dest: /find-forms/about-form-10-2850a/
  - param_name: "formno"
    param_value: ^0426$
    dest: /find-forms/about-form-10-0426/
  - param_name: "formno"
    param_value: ^10ec$
    dest: /find-forms/about-form-10-10ec/
  - param_name: "formno"
    param_value: ^29-4125$
    dest: /find-forms/about-form-29-4125/
  - param_name: "formno"
    param_value: ^10ezr$
    dest: /find-forms/about-form-10-10ezr/
  - param_name: "formno"
    param_value: ^20-0998$
    dest: /find-forms/about-form-20-0998/
  - param_name: "formno"
    param_value: ^2850$
    dest: /find-forms/about-form-10-2850/
  - param_name: "formno"
    param_value: ^9$
    dest: /find-forms/about-form-9/
  - param_name: "formno"
    param_value: ^40-1330$
    dest: /find-forms/about-form-40-1330/
  - param_name: "formno"
    param_value: ^583$
    dest: /find-forms/about-form-10-583/
  - param_name: "formno"
    param_value: ^21-4502$
    dest: /find-forms/about-form-21-4502/
  - param_name: "formno"
    param_value: ^21-526$
    dest: /find-forms/about-form-21-526ez/
  - param_name: "formno"
    param_value: ^21-526b$
    dest: /find-forms/about-form-21-526ez/
  - param_name: "formno"
    param_value: ^10ez%20\(pdf\)$
    dest: /find-forms/about-form-10-10ez/
  - param_name: "formno"
    param_value: ^22-1990n$
    dest: /find-forms/about-form-22-1990n/
  - param_name: "formno"
    param_value: ^40-10007$
    dest: /find-forms/about-form-40-10007/
`);

const BASE_URL = `https://dev.va.gov`;

describe('form detail redirects', () => {
  it('has a catch-all', async () => {
    [
      `${BASE_URL}vaforms/form_detail.asp`,
      `${BASE_URL}vaforms/FORM_DETAILS.asp`,
      `${BASE_URL}vaforms/form_detail.asp?formno=123456`,
    ].forEach(async url => {
      const response = await fetch(url);
      chai.expect(response.url).to.be.equal(`${BASE_URL}/find-forms/`);
    });
  });

  it('does not redirect too much', async () => {
    const response = await fetch(`${BASE_URL}/testing/`);
    chai.expect(response.url).to.be.equal(`${BASE_URL}/testing/`);
  });

  for (const redirect of redirectConfig.redirects_by_query) {
    const { param_name, param_value, dest } = redirect;

    const trimmedParamValue = param_value.replace('^', '').replace('$', '');

    it(`redirects by form no ${param_value}`, async () => {
      for (const url of [
        `${BASE_URL}/vaforms/form_detail.asp?FormNo=${trimmedParamValue}`,
        `${BASE_URL}/vaforms/form_detail.asp?FormNo=${trimmedParamValue.toUpperCase()}`,
        `${BASE_URL}/vaforms/form_detail.asp?formno=${trimmedParamValue}`,
        `${BASE_URL}/vaforms/form_detail.asp?formno=${trimmedParamValue.toUpperCase()}`,
      ]) {
        console.log(url);

        const response = await fetch(url);
        chai
          .expect(response.url)
          .to.be.equal(
            `${dest.startsWith('https') ? '' : BASE_URL}${dest}`,
            `${url} redirects to ${dest}`,
          );
      }
    });
  }
});
