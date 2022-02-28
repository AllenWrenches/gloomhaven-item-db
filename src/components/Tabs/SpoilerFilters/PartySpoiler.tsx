import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Form, Popup, Icon } from "semantic-ui-react";
import {
	classesInUseState,
	classToDeleteState,
	envelopeXState,
	itemManagementTypeState,
} from "../../../State";
import {
	ClassesInUse,
	FCClasses,
	FHClasses,
	getGHClassList,
	ItemManagementType,
	JOTLClasses,
} from "../../../State/Types";
import { ClassList } from "./ClassList";

export const PartySpoiler = () => {
	const envelopeX = useRecoilValue(envelopeXState);
	const [classesInUse, setClassesInUse] = useRecoilState(classesInUseState);
	const setClassToDelete = useSetRecoilState(classToDeleteState);
	const itemManagementType = useRecoilValue(itemManagementTypeState);
	const toggleClassFilter = (key: ClassesInUse) => {
		if (classesInUse.includes(key)) {
			setClassToDelete(key);
		} else {
			const newClassesInUse = Object.assign([], classesInUse);
			newClassesInUse.push(key);
			setClassesInUse(newClassesInUse);
		}
	};

	if (itemManagementType !== ItemManagementType.Party) {
		return null;
	}

	const ghList = getGHClassList(envelopeX);
	return (
		<Form.Group inline className={"inline-break"}>
			<Form.Group inline>
				<label>Party Members:</label>
				{
					<Popup
						closeOnDocumentClick
						hideOnScroll
						trigger={
							<Icon name={"question circle"} className={"blue"} />
						}
						header={"Party Members"}
						content={
							"Click on a class icon to add that class to you party.  You can then assign items to any members in a party. Clicking on member a second time will remove all items."
						}
					/>
				}
			</Form.Group>
			<ClassList
				classes={ghList}
				label="Gloomhaven:"
				onClick={toggleClassFilter}
				isUsed={(className: ClassesInUse) =>
					classesInUse.includes(className)
				}
			/>
			<ClassList
				classes={Object.values(FCClasses)}
				label="Forgotten Circles:"
				onClick={toggleClassFilter}
				isUsed={(className: ClassesInUse) =>
					classesInUse.includes(className)
				}
			/>
			<ClassList
				classes={Object.values(JOTLClasses)}
				label="Jaws of the Lion:"
				onClick={toggleClassFilter}
				isUsed={(className: ClassesInUse) =>
					classesInUse.includes(className)
				}
			/>
			<ClassList
				classes={Object.values(FHClasses)}
				label="Frosthaven:"
				onClick={toggleClassFilter}
				isUsed={(className: ClassesInUse) =>
					classesInUse.includes(className)
				}
			/>
		</Form.Group>
	);
};
