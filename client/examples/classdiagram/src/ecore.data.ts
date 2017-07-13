export const examplePackage = {
  eClassifiers: [
    {
      eClass: 'http://www.eclipse.org/emf/2002/Ecore#//EClass',
      name: 'class1',
      eStructuralFeatures: [
        {
          eClass: 'http://www.eclipse.org/emf/2002/Ecore#//EReference',
          name: 'ref1',
          eType: 1
        },
        {
          eClass: "http://www.eclipse.org/emf/2002/Ecore#//EAttribute",
          name: "label",
          eType: {
            $ref: "http://www.eclipse.org/emf/2002/Ecore#//EString"
          }
        }
      ]
    },
    {
      eClass: 'http://www.eclipse.org/emf/2002/Ecore#//EClass',
      name: 'class2',
      eStructuralFeatures: [
        {
          eClass: "http://www.eclipse.org/emf/2002/Ecore#//EAttribute",
          name: "isFemale",
          eType: {
            $ref: "http://www.eclipse.org/emf/2002/Ecore#//EBoolean"
          }
        },
        {
          eClass: "http://www.eclipse.org/emf/2002/Ecore#//EAttribute",
          name: "age",
          eType: {
            $ref: "http://www.eclipse.org/emf/2002/Ecore#//EInteger"
          }
        },
      ]
    },
    {
      eClass: 'http://www.eclipse.org/emf/2002/Ecore#//EDataType',
      name: 'MyDataType'
    },
    {
      eClass: 'http://www.eclipse.org/emf/2002/Ecore#//EEnum',
      name: 'MyEnum'
    }
  ],
  'name': 'MyPackage'
};
