import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import _ from 'lodash/fp';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { educationWizard10203 } from '../selectors/educationWizard';
import { connect } from 'react-redux';
import localStorage from 'platform/utilities/storage/localStorage';

const levels = [
  ['newBenefit'],
  ['serviceBenefitBasedOn', 'transferredEduBenefits'],
  ['nationalCallToService', 'sponsorDeceasedDisabledMIA'],
  ['vetTecBenefit'],
  ['sponsorTransferredBenefits'],
  ['applyForScholarship'],
];
class IntroductionPage extends React.Component {
  constructor(props) {
    super(props);
    // flattens all the fields in levels into object keys
    this.state = []
      .concat(...levels)
      .reduce((state, field) => Object.assign(state, { [field]: null }), {
        open: false,
        educationBenefitSelected:
          localStorage.getItem('educationBenefitSelected') || 'false',
        hasWizardBeenCompleted:
          localStorage.getItem('isEduWizardCompleted') || 'false',
      });
  }

  componentDidUpdate() {
    const {
      newBenefit,
      serviceBenefitBasedOn,
      nationalCallToService,
      transferredEduBenefits,
      sponsorDeceasedDisabledMIA,
      sponsorTransferredBenefits,
      vetTecBenefit,
      applyForScholarship,
      hasWizardBeenCompleted,
    } = this.state;
    if (hasWizardBeenCompleted === 'false') {
      if (
        newBenefit === 'yes' &&
        nationalCallToService === 'no' &&
        vetTecBenefit === 'no'
      ) {
        this.setWizardComplete();
        this.setEduBenefitFormSelected('1990');
      } else if (
        newBenefit === 'yes' &&
        nationalCallToService === 'no' &&
        vetTecBenefit === 'yes'
      ) {
        this.getButton('0994');
      } else if (
        newBenefit === 'no' &&
        (transferredEduBenefits === 'transferred' ||
          transferredEduBenefits === 'own')
      ) {
        this.getButton('1995');
      } else if (newBenefit === 'no' && transferredEduBenefits === 'fry') {
        this.getButton('5495');
      } else if (
        newBenefit === 'yes' &&
        serviceBenefitBasedOn === 'other' &&
        sponsorDeceasedDisabledMIA === 'yes'
      ) {
        this.getButton('5490');
      } else if (
        newBenefit === 'yes' &&
        serviceBenefitBasedOn === 'other' &&
        sponsorDeceasedDisabledMIA === 'no' &&
        sponsorTransferredBenefits !== null
      ) {
        this.getButton('1990E');
      }
    }
  }

  getButton(formId) {
    const url =
      formId === '0994'
        ? `/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994`
        : `/education/apply-for-education-benefits/application/${formId}`;

    return (
      <a
        id="apply-now-link"
        href={url}
        className="usa-button va-button-primary"
        onClick={() => {
          this.recordWizardValues();
          this.setWizardComplete();
          this.setEduBenefitFormSelected(formId);
        }}
      >
        Apply now
      </a>
    );
  }

  answerQuestion = (field, answer) => {
    const newState = Object.assign({}, { [field]: answer });
    if (field === 'newBenefit') {
      recordEvent({
        event: 'edu-howToApply-formChange',
        'edu-form-field': 'benefitUpdate',
        'edu-form-value': this.eduFormChange(answer),
      });
    }

    // drop all the levels until we see the current question, then reset
    // everything at that level and beyond, so we don't see questions from
    // different branches
    const fields = [].concat(
      ..._.dropWhile(level => !level.includes(field), levels),
    );
    fields.forEach(laterField => {
      if (laterField !== field) {
        newState[laterField] = null;
      }
    });

    this.setState(newState);
  };

  eduFormChange = input => {
    const formChangeMap = {
      yes: 'new',
      no: 'update',
      extend: 'stem-scholarship',
    };
    return formChangeMap[input] || null;
  };

  isReceivingSponsorBenefits = input => {
    const formChangeMap = {
      own: 'no',
      transferred: 'yes',
      fry: 'no with scholarship',
    };
    return formChangeMap[input] || null;
  };

  isBenefitClaimForSelf = input => {
    const formChangeMap = {
      own: 'yes',
      other: 'no',
    };
    return formChangeMap[input] || null;
  };

  recordWizardValues = () => {
    recordEvent({
      event: 'edu-howToApply-applyNow',
      'edu-benefitUpdate': this.eduFormChange(this.state.newBenefit),
      'edu-isBenefitClaimForSelf': this.isBenefitClaimForSelf(
        this.state.serviceBenefitBasedOn,
      ),
      'edu-isNationalCallToServiceBenefit': this.state.nationalCallToService,
      'edu-isVetTec': this.state.vetTecBenefit,
      'edu-hasSponsorTransferredBenefits': this.state
        .sponsorTransferredBenefits,
      'edu-isReceivingSponsorBenefits': this.isReceivingSponsorBenefits(
        this.state.transferredEduBenefits,
      ),
      'edu-isSponsorReachable': this.state.sponsorDeceasedDisabledMIA,
      'edu-stemApplicant': this.state.applyForScholarship,
    });
  };

  setWizardComplete = () => {
    localStorage.setItem('isEduWizardCompleted', 'true');
    this.setState({
      hasWizardBeenCompleted: localStorage.getItem('isEduWizardCompleted'),
    });
  };

  setEduBenefitFormSelected = formId => {
    localStorage.setItem('educationBenefitSelected', formId);
    this.setState({
      educationBenefitSelected: localStorage.getItem(
        'educationBenefitSelected',
      ),
    });
  };

  render() {
    const {
      newBenefit,
      serviceBenefitBasedOn,
      nationalCallToService,
      transferredEduBenefits,
      sponsorDeceasedDisabledMIA,
      sponsorTransferredBenefits,
      vetTecBenefit,
      applyForScholarship,
      open,
      hasWizardBeenCompleted,
      educationBenefitSelected,
    } = this.state;

    const { showSTEMScholarship } = this.props;

    const form1995 = showSTEMScholarship ? '10203' : '1995';

    const buttonClasses = classNames('usa-button-primary', 'wizard-button', {
      'va-button-primary': !this.state.open,
    });
    const contentClasses = classNames(
      'form-expanding-group-open',
      'wizard-content',
      {
        'wizard-content-closed': !this.state.open,
      },
    );
    const newBenefitOptions = [
      { label: 'Applying for a new benefit', value: 'yes' },
      {
        label: (
          <span className="radioText">
            Updating my program of study or place of training
          </span>
        ),
        value: 'no',
      },
      {
        label: (
          <span className="radioText">
            Applying to extend my Post-9/11 or Fry Scholarship benefits using
            the Edith Nourse Rogers STEM Scholarship
          </span>
        ),
        value: 'extend',
      },
    ];
    return (
      <div>
        <FormTitle title="apply-wizards" />
        <p>Equal to VA Form (apply-wizards).</p>
        {hasWizardBeenCompleted === 'false' && (
          <div className="wizard-container">
            <button
              aria-expanded={this.state.open ? 'true' : 'false'}
              aria-controls="wizardOptions"
              className={buttonClasses}
              onClick={() => this.setState({ open: !this.state.open })}
            >
              Find your education benefits form
            </button>
            {open && (
              <div className={contentClasses} id="wizardOptions">
                <div className="wizard-content-inner">
                  <ErrorableRadioButtons
                    additionalFieldsetClass="wizard-fieldset"
                    name="newBenefit"
                    id="newBenefit"
                    options={newBenefitOptions}
                    onValueChange={({ value }) =>
                      this.answerQuestion('newBenefit', value)
                    }
                    value={{ value: newBenefit }}
                    label="Are you applying for a benefit or updating your program or place of training?"
                  />
                  {newBenefit === 'yes' && (
                    <ErrorableRadioButtons
                      additionalFieldsetClass="wizard-fieldset"
                      name="serviceBenefitBasedOn"
                      id="serviceBenefitBasedOn"
                      options={[
                        { label: 'Yes', value: 'own' },
                        { label: 'No', value: 'other' },
                      ]}
                      onValueChange={({ value }) =>
                        this.answerQuestion('serviceBenefitBasedOn', value)
                      }
                      value={{ value: serviceBenefitBasedOn }}
                      label="Are you a Veteran or service member claiming a benefit based on your own service?"
                    />
                  )}
                  {newBenefit === 'no' && (
                    <ErrorableRadioButtons
                      additionalFieldsetClass="wizard-fieldset"
                      name="transferredEduBenefits"
                      id="transferredEduBenefits"
                      options={[
                        {
                          label: 'No, I’m using my own benefit.',
                          value: 'own',
                        },
                        {
                          label: 'Yes, I’m using a transferred benefit.',
                          value: 'transferred',
                        },
                        {
                          label: (
                            <span className="radioText">
                              No, I’m using the Fry Scholarship or DEA (Chapter
                              35)
                            </span>
                          ),
                          value: 'fry',
                        },
                      ]}
                      onValueChange={({ value }) =>
                        this.answerQuestion('transferredEduBenefits', value)
                      }
                      value={{ value: transferredEduBenefits }}
                      label="Are you receiving education benefits transferred to you by a sponsor Veteran?"
                    />
                  )}
                  {serviceBenefitBasedOn === 'own' && (
                    <ErrorableRadioButtons
                      additionalFieldsetClass="wizard-fieldset"
                      name="nationalCallToService"
                      id="nationalCallToService"
                      options={[
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                      ]}
                      onValueChange={({ value }) =>
                        this.answerQuestion('nationalCallToService', value)
                      }
                      value={{ value: nationalCallToService }}
                      label={
                        <span>
                          Are you claiming a{' '}
                          <strong>National Call to Service</strong> education
                          benefit? (This is uncommon)
                        </span>
                      }
                    />
                  )}
                  {serviceBenefitBasedOn === 'own' &&
                    nationalCallToService === 'no' && (
                      <ErrorableRadioButtons
                        additionalFieldsetClass="wizard-fieldset"
                        name="vetTecBenefit"
                        id="vetTecBenefit"
                        options={[
                          { label: 'Yes', value: 'yes' },
                          { label: 'No', value: 'no' },
                        ]}
                        onValueChange={({ value }) =>
                          this.answerQuestion('vetTecBenefit', value)
                        }
                        value={{ value: vetTecBenefit }}
                        label={
                          <span>
                            Are you applying for Veteran Employment Through
                            Technology Education Courses (VET TEC)?
                          </span>
                        }
                      />
                    )}
                  {serviceBenefitBasedOn === 'other' && (
                    <ErrorableRadioButtons
                      additionalFieldsetClass="wizard-fieldset"
                      name="sponsorDeceasedDisabledMIA"
                      id="sponsorDeceasedDisabledMIA"
                      options={[
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                      ]}
                      onValueChange={({ value }) =>
                        this.answerQuestion('sponsorDeceasedDisabledMIA', value)
                      }
                      value={{ value: sponsorDeceasedDisabledMIA }}
                      label="Is your sponsor deceased, 100% permanently disabled, MIA, or a POW?"
                    />
                  )}
                  {sponsorDeceasedDisabledMIA === 'no' && (
                    <ErrorableRadioButtons
                      name="sponsorTransferredBenefits"
                      id="sponsorTransferredBenefits"
                      options={[
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                      ]}
                      onValueChange={({ value }) =>
                        this.answerQuestion('sponsorTransferredBenefits', value)
                      }
                      value={{ value: sponsorTransferredBenefits }}
                      label="Has your sponsor transferred their benefits to you?"
                    />
                  )}
                  {newBenefit === 'yes' &&
                    serviceBenefitBasedOn === 'other' &&
                    sponsorDeceasedDisabledMIA === 'no' &&
                    sponsorTransferredBenefits === 'no' && (
                      <div className="usa-alert usa-alert-warning">
                        <div className="usa-alert-body">
                          <h4>
                            Your application can't be approved until your
                            sponsor transfers their benefits.
                          </h4>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://milconnect.dmdc.osd.mil/milconnect/public/faq/Education_Benefits-How_to_Transfer_Benefits"
                          >
                            Instructions for your sponsor to transfer education
                            benefits.
                          </a>
                        </div>
                      </div>
                    )}
                  {newBenefit === 'yes' &&
                    nationalCallToService === 'yes' && (
                      <div>
                        <div className="usa-alert usa-alert-warning">
                          <div className="usa-alert-body">
                            <h4 className="usa-alert-heading wizard-alert-heading">
                              Are you sure?
                            </h4>
                            <p>
                              Are all of the following things true of your
                              service?
                            </p>
                            <ul>
                              <li>
                                Enlisted under the National Call to Service
                                program, <strong>and</strong>
                              </li>
                              <li>
                                Entered service between 10/01/03 and 12/31/07,{' '}
                                <strong>and</strong>
                              </li>
                              <li>Chose education benefits</li>
                            </ul>
                          </div>
                        </div>
                        {this.getButton('1990N')}
                      </div>
                    )}
                  {newBenefit === 'extend' && (
                    <div className="wizard-edith-nourse-content">
                      <br />
                      <strong>
                        To be eligible for the{' '}
                        <a
                          href="https://benefits.va.gov/gibill/fgib/stem.asp"
                          onClick={() =>
                            recordEvent({
                              event: 'edu-navigation',
                              'edu-action': 'stem-scholarship',
                            })
                          }
                        >
                          Edith Nourse Rogers STEM Scholarship
                        </a>
                        , you must meet all the requirements below. You:
                      </strong>
                      <ul className="wizard-edith-nourse-content">
                        <li>
                          Are using or recently used Post-9/11 GI Bill or Fry
                          Scholarship benefits
                        </li>
                        <li>
                          Have used all your education benefits or are within 6
                          months of doing so.{' '}
                          <a
                            className="checkBenefitsLink"
                            href="../gi-bill/post-9-11/ch-33-benefit/"
                            onClick={() =>
                              recordEvent({
                                event: 'edu-navigation',
                                'edu-action': 'check-remaining-benefits',
                              })
                            }
                          >
                            Check remaining benefits
                          </a>
                        </li>
                        <li>
                          Are enrolled in an undergraduate degree program for
                          science, technology, engineering or math (STEM),{' '}
                          <strong>or</strong> have already earned a STEM degree
                          and are pursuing a teaching certification.{' '}
                          <a
                            href="https://benefits.va.gov/gibill/docs/fgib/STEM_Program_List.pdf"
                            onClick={() =>
                              recordEvent({
                                event: 'edu-navigation',
                                'edu-action': 'see-approved-stem-programs',
                              })
                            }
                          >
                            See approved STEM programs
                          </a>
                        </li>
                      </ul>

                      <ErrorableRadioButtons
                        additionalFieldsetClass="wizard-fieldset"
                        name="applyForScholarship"
                        id="applyForScholarship"
                        options={[
                          { label: 'Yes', value: 'yes' },
                          { label: 'No', value: 'no' },
                        ]}
                        onValueChange={({ value }) =>
                          this.answerQuestion('applyForScholarship', value)
                        }
                        value={{ value: applyForScholarship }}
                        label="Based on the eligibility requirements above, do you want to apply for this scholarship?"
                      />
                      <div className="vads-u-padding-top--2">
                        {(applyForScholarship === 'yes' &&
                          this.getButton(form1995)) ||
                          (applyForScholarship === 'no' && (
                            <p>
                              Learn what other education benefits you may be
                              eligible for on the{' '}
                              <a href="../eligibility/">
                                GI Bill eligibility page
                              </a>
                              .
                            </p>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {educationBenefitSelected === '1990' &&
          hasWizardBeenCompleted === 'true' && (
            <div className="schemaform-intro">
              <SaveInProgressIntro
                prefillEnabled={this.props.route.formConfig.prefillEnabled}
                messages={this.props.route.formConfig.savedFormMessages}
                pageList={this.props.route.pageList}
                startText="Start the Application"
              >
                Please complete the form to apply for benefits.
              </SaveInProgressIntro>
              <h4>Follow the steps below to apply for benefits.</h4>
              <div className="process schemaform-process">
                <ol>
                  <li className="process-step list-one">
                    <h5>Prepare</h5>
                    <h6>To fill out this application, you’ll need your:</h6>
                    <ul>
                      <li>Social Security number (required)</li>
                    </ul>
                    <p>
                      <strong>
                        What if I need help filling out my application?
                      </strong>{' '}
                      An accredited representative, like a Veterans Service
                      Officer (VSO), can help you fill out your claim.{' '}
                      <a href="/disability-benefits/apply/help/index.html">
                        Get help filing your claim
                      </a>
                    </p>
                  </li>
                  <li className="process-step list-two">
                    <h5>Apply</h5>
                    <p>Complete this benefits form.</p>
                    <p>
                      After submitting the form, you’ll get a confirmation
                      message. You can print this for your records.
                    </p>
                  </li>
                  <li className="process-step list-three">
                    <h5>VA Review</h5>
                    <p>
                      We process claims within a week. If more than a week has
                      passed since you submitted your application and you
                      haven’t heard back, please don’t apply again. Call us at.
                    </p>
                  </li>
                  <li className="process-step list-four">
                    <h5>Decision</h5>
                    <p>
                      Once we’ve processed your claim, you’ll get a notice in
                      the mail with our decision.
                    </p>
                  </li>
                </ol>
              </div>
              <SaveInProgressIntro
                buttonOnly
                messages={this.props.route.formConfig.savedFormMessages}
                pageList={this.props.route.pageList}
                startText="Start the Application"
              />
              <div
                className="omb-info--container"
                style={{ paddingLeft: '0px' }}
              >
                <OMBInfo resBurden={30} ombNumber="" expDate="12/31/2021" />
              </div>
            </div>
          )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  showSTEMScholarship: educationWizard10203(state),
});

export default connect(mapStateToProps)(IntroductionPage);
