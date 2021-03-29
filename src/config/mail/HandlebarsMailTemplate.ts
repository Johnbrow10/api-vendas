import handlebars from 'handlebars';
import fs from 'fs';

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParse {
  file: string;
  variables: ITemplateVariable;
}

export default class HandlebarsMailTemplate {
  public async parse({ file, variables }: IParse): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
