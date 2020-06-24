# Form System API Reference

### Overview

Building a form using the VA form system starts with a form configuration object (referred to as formConfig). The form configuration object is the file that the form system uses to build a form. Inside this configuration goes not only things like what URL you want your form to submit to or what Google Analytics Prefix you want to be added to the events that come off the shelf with the form system, but also all of the pages of your form as well as what fields and validation you want on those pages. 

The form configuration is written in JSON and can include JavaScript as well as React components at certain times.

This API reference begins with the larger formConfig object and then branches out into the details of each individual option inside the object.

<hr>

### Topics

[chapters]()
[formConfig]()
[Pages]()
[schema]()
[uiSchema]()

## 

## Other topics
[Redux]()
[unit tests]()


<hr>

<!-- TODO: Add a link for how to let us know -->
<!-- TODO: Link to the documentation repo to make it easier to submit a PR -->



**If you're not sure where to find the configuration option you're looking
for,** understanding what you're configuring will help. Configuration options
are available at
- The `formConfig` level
  - See [**Customizing Your Form**](./customizing-your-form.md) for more information.
  - [**`formConfig` Options**](./formconfig-options.md) contains the full list
    of options available.
- The [Chapter level](./chapter-options.md)
- The [Page level](./page-options.md)
- The input field level
  - `uiSchema` options are used at this level

`uiSchema` options may be used by:
- The [`ui:field`](./available-uifields.md) component
- The [`ui:widget`](./available-uiwidgets.md) component
- [Helper functions](./other-uischema-options.md) that live outside both
  `ui:field` and `ui:widget`.

The forms library will determine the `ui:field` and `ui:widget` components in
one of two ways. It will either use:
- The `uiSchema`'s `ui:field` and `ui:widget`, or
- The default `ui:field` and `ui:widget` for the [**schema
    type**](schema-types.md)

## What each reference section contains
The first section, [**Schema Types**](schema-types.md) contains—you guessed it—a
**list of available types** for your schema. You'll also find the **default
fields and widgets** used for each type as well as **alternative widgets**
designed for them.

[**Available `ui:field`s**](available-uifields.md) provides a list of all fields and
all `uiSchema` options they use.

Similarly, [**Available `ui:widget`s**](./available-uiwidgets.md) provides a list of
all widgets and all `uiSchema` options they use.

[**`formConfig` Options**](./formconfig-options.md) covers all the options available
at the root `formConfig` level, such as the `urlPrefix` and `submitUrl`.

[**Page Options**](./page-options.md) lists all options available for every page,
such as `schema`, `uiSchema`, and `arrayPath`.
